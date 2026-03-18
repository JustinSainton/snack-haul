import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { useAppStore } from "@/src/stores/useAppStore";

const avatars = [
  { id: "avatar_1", emoji: "🐶" },
  { id: "avatar_2", emoji: "🐱" },
  { id: "avatar_3", emoji: "🐼" },
  { id: "avatar_4", emoji: "🦊" },
  { id: "avatar_5", emoji: "🐸" },
  { id: "avatar_6", emoji: "🦄" },
  { id: "avatar_7", emoji: "🐙" },
  { id: "avatar_8", emoji: "🦋" },
];

const avatarEmojis: Record<string, string> = Object.fromEntries(
  avatars.map((a) => [a.id, a.emoji])
);

export default function ProfileCreate() {
  const router = useRouter();
  const setName = useProfilesStore((s) => s.setName);
  const setAvatarId = useProfilesStore((s) => s.setAvatarId);
  const linkToParent = useProfilesStore((s) => s.linkToParent);
  const activeProfileId = useProfilesStore((s) => s.activeProfileId);
  const activeProfile = useProfilesStore((s) =>
    s.activeProfileId ? s.profiles[s.activeProfileId] : null
  );
  const parentProfiles = useProfilesStore((s) => s.getParentProfiles());
  const markOnboarded = useAppStore((s) => s.markOnboarded);

  const [name, setLocalName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("avatar_1");
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const isKid = activeProfile?.coppaRestricted ?? false;
  // Filter out the current profile from parent candidates
  const availableParents = parentProfiles.filter(
    (p) => p.id !== activeProfileId
  );

  function handleFinish() {
    setName(name.trim() || "Snacker");
    setAvatarId(selectedAvatar);
    if (isKid && selectedParentId) {
      linkToParent(selectedParentId);
    }
    if (activeProfileId) markOnboarded(activeProfileId);
    router.replace("/(tabs)");
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-8 pt-16 pb-12"
    >
      <Text className="mb-2 text-3xl font-bold text-foreground">
        Almost there!
      </Text>
      <Text className="mb-8 text-base text-muted">
        Pick a name and avatar for your snack profile.
      </Text>

      <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
        Your Name
      </Text>
      <TextInput
        value={name}
        onChangeText={setLocalName}
        placeholder="What should we call you?"
        placeholderTextColor="#9A8F8A"
        className="mb-8 rounded-xl border border-border bg-white px-4 py-3 text-base text-foreground"
        maxLength={20}
      />

      <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Pick an Avatar
      </Text>
      <View className="mb-8 flex-row flex-wrap gap-3">
        {avatars.map((avatar) => (
          <Pressable
            key={avatar.id}
            onPress={() => setSelectedAvatar(avatar.id)}
            className={`h-16 w-16 items-center justify-center rounded-2xl border-2 ${
              selectedAvatar === avatar.id
                ? "border-primary bg-white"
                : "border-transparent bg-white"
            }`}
          >
            <Text className="text-3xl">{avatar.emoji}</Text>
          </Pressable>
        ))}
      </View>

      {/* Parent linking for kid profiles */}
      {isKid && availableParents.length > 0 && (
        <View className="mb-8">
          <Text className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">
            Link to a Parent
          </Text>
          <Text className="mb-3 text-sm text-muted">
            Connect your profile so you can request snacks!
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {availableParents.map((parent) => (
              <Pressable
                key={parent.id}
                onPress={() => setSelectedParentId(parent.id)}
                className={`items-center rounded-2xl px-4 py-3 ${
                  selectedParentId === parent.id
                    ? "bg-secondary"
                    : "bg-white border border-border"
                }`}
              >
                <Text className="text-2xl">
                  {avatarEmojis[parent.avatarId] || "🐶"}
                </Text>
                <Text
                  className={`mt-1 text-sm font-medium ${
                    selectedParentId === parent.id
                      ? "text-white"
                      : "text-foreground"
                  }`}
                >
                  {parent.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <Pressable
        onPress={handleFinish}
        className="w-full rounded-2xl bg-secondary px-8 py-4 active:opacity-80"
      >
        <Text className="text-center text-lg font-bold text-white">
          Start Snacking!
        </Text>
      </Pressable>
    </ScrollView>
  );
}
