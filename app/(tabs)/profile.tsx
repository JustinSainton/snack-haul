import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { useAppStore } from "@/src/stores/useAppStore";
import { getInstacartLink } from "@/src/services/affiliate/instacart";
import { colors } from "@/src/constants/colors";
import type { Profile } from "@/src/types/profile";
import type { SnackRequest } from "@/src/types/snackRequest";

const avatarEmojis: Record<string, string> = {
  avatar_1: "🐶",
  avatar_2: "🐱",
  avatar_3: "🐼",
  avatar_4: "🦊",
  avatar_5: "🐸",
  avatar_6: "🦄",
  avatar_7: "🐙",
  avatar_8: "🦋",
};

function ProfilePill({
  profile,
  isActive,
  onPress,
  onLongPress,
}: {
  profile: Profile;
  isActive: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className={`mr-3 items-center rounded-2xl px-4 py-3 ${
        isActive ? "bg-primary" : "bg-white border border-border"
      }`}
    >
      <Text className="text-2xl">{avatarEmojis[profile.avatarId] || "🐶"}</Text>
      <Text
        className={`mt-1 text-xs font-medium ${
          isActive ? "text-white" : "text-foreground"
        }`}
        numberOfLines={1}
      >
        {profile.name || "Snacker"}
      </Text>
    </Pressable>
  );
}

function RequestCard({
  request,
  onApprove,
  onDismiss,
}: {
  request: SnackRequest;
  onApprove: () => void;
  onDismiss: () => void;
}) {
  return (
    <View className="mb-3 flex-row items-center rounded-2xl bg-white p-3">
      {request.snackImageUrl ? (
        <Image
          source={{ uri: request.snackImageUrl }}
          style={{ width: 56, height: 56, borderRadius: 12 }}
          contentFit="cover"
        />
      ) : (
        <View className="h-14 w-14 items-center justify-center rounded-xl bg-border">
          <Text className="text-xl">🍬</Text>
        </View>
      )}

      <View className="ml-3 flex-1">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {request.snackName}
        </Text>
        <Text className="text-xs text-muted">
          Requested by {request.requestedByName}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          onPress={onDismiss}
          className="rounded-lg bg-border p-2"
          hitSlop={8}
        >
          <Ionicons name="close" size={18} color={colors.muted} />
        </Pressable>
        <Pressable
          onPress={onApprove}
          className="rounded-lg bg-secondary p-2"
          hitSlop={8}
        >
          <Ionicons name="cart-outline" size={18} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const profiles = useProfilesStore((s) => s.profiles);
  const activeProfileId = useProfilesStore((s) => s.activeProfileId);
  const profile = useProfilesStore((s) => s.active());
  const setActiveProfile = useProfilesStore((s) => s.setActiveProfile);
  const deleteProfile = useProfilesStore((s) => s.deleteProfile);
  const resetSurvey = useProfilesStore((s) => s.resetSurvey);
  const getRequestsForParent = useProfilesStore((s) => s.getRequestsForParent);
  const getLinkedKids = useProfilesStore((s) => s.getLinkedKids);
  const approveRequest = useProfilesStore((s) => s.approveRequest);
  const dismissRequest = useProfilesStore((s) => s.dismissRequest);
  const removeOnboarded = useAppStore((s) => s.removeOnboarded);

  const profileList = Object.values(profiles);

  // Get pending requests if this is a parent profile
  const pendingRequests = activeProfileId
    ? getRequestsForParent(activeProfileId)
    : [];
  const linkedKids = activeProfileId ? getLinkedKids(activeProfileId) : [];

  function handleDeleteProfile(p: Profile) {
    if (profileList.length <= 1) {
      Alert.alert("Can't delete", "You need at least one profile.");
      return;
    }
    Alert.alert(
      `Delete ${p.name || "this profile"}?`,
      "This will remove all their preferences and favorites.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeOnboarded(p.id);
            deleteProfile(p.id);
          },
        },
      ]
    );
  }

  async function handleApproveRequest(request: SnackRequest) {
    approveRequest(request.id);
    const link = getInstacartLink(request.snackName, request.snackBrand);
    await WebBrowser.openBrowserAsync(link);
  }

  function handleRetakeSurvey() {
    if (!activeProfileId) return;
    resetSurvey();
    removeOnboarded(activeProfileId);
    router.replace("/(onboarding)/survey/flavors");
  }

  if (!profile) return null;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="pt-16 pb-12"
    >
      {/* Profile switcher */}
      <View className="px-6 pb-6">
        <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Profiles
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {profileList.map((p) => (
            <ProfilePill
              key={p.id}
              profile={p}
              isActive={p.id === activeProfileId}
              onPress={() => setActiveProfile(p.id)}
              onLongPress={() => handleDeleteProfile(p)}
            />
          ))}
          <Pressable
            onPress={() => router.push("/(onboarding)/welcome")}
            className="mr-3 items-center justify-center rounded-2xl border-2 border-dashed border-border px-4 py-3"
          >
            <Text className="text-2xl">+</Text>
            <Text className="mt-1 text-xs font-medium text-muted">Add</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Active profile details */}
      <View className="items-center px-6 pb-4">
        <Text className="text-6xl">
          {avatarEmojis[profile.avatarId] || "🐶"}
        </Text>
        <Text className="mt-2 text-2xl font-bold text-foreground">
          {profile.name || "Snacker"}
        </Text>
        <Text className="text-base text-accent">
          {profile.snackProfileLabel}
        </Text>
        {profile.coppaRestricted && (
          <View className="mt-2 rounded-full bg-tertiary/20 px-3 py-1">
            <Text className="text-xs font-medium text-foreground">
              Kid Mode
            </Text>
          </View>
        )}
        {linkedKids.length > 0 && (
          <Text className="mt-2 text-xs text-muted">
            Parent of {linkedKids.map((k) => k.name).join(", ")}
          </Text>
        )}
      </View>

      {/* Pending snack requests (parent view) */}
      {pendingRequests.length > 0 && (
        <View className="px-6 pb-4">
          <Text className="mb-3 text-lg font-bold text-foreground">
            🔔 Snack Requests
          </Text>
          {pendingRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onApprove={() => handleApproveRequest(req)}
              onDismiss={() => dismissRequest(req.id)}
            />
          ))}
        </View>
      )}

      {/* Actions */}
      <View className="gap-3 px-6">
        <Pressable
          onPress={handleRetakeSurvey}
          className="rounded-xl border border-border bg-white px-4 py-3 active:opacity-80"
        >
          <Text className="text-center text-base font-medium text-foreground">
            Retake Snack Survey
          </Text>
        </Pressable>

        <View className="mt-4 rounded-xl bg-white p-4">
          <Text className="mb-2 text-sm font-semibold text-muted">
            Your Favorites
          </Text>
          <Text className="text-sm text-muted">
            {profile.favoriteSnackIds.length} snacks ·{" "}
            {profile.favoriteRecipeIds.length} recipes
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
