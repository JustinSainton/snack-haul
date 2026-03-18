import { Text, Pressable, Share, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { useCOPPA } from "@/src/hooks/useCOPPA";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { getInstacartLink } from "@/src/services/affiliate/instacart";

interface BuyButtonProps {
  productName: string;
  brand?: string;
  snackId?: string;
  imageUrl?: string | null;
}

export function BuyButton({ productName, brand, snackId, imageUrl }: BuyButtonProps) {
  const { isRestricted } = useCOPPA();
  const linkedParentId = useProfilesStore((s) => {
    const id = s.activeProfileId;
    return id ? s.profiles[id]?.linkedParentId : null;
  });
  const createRequest = useProfilesStore((s) => s.createSnackRequest);
  const link = getInstacartLink(productName, brand);

  const hasParent = !!linkedParentId;

  async function handlePress() {
    if (isRestricted) {
      // Create a snack request if linked to a parent
      if (hasParent && snackId) {
        createRequest({
          id: snackId,
          name: productName,
          brand: brand || "",
          imageUrl: imageUrl ?? null,
        });
        Alert.alert(
          "Request Sent! 🎉",
          `We let your parent know you want ${productName}! They'll see it on their profile.`
        );
      } else {
        // No parent linked — fall back to share sheet
        try {
          await Share.share({
            message: `Hey! Can you get me ${productName}? Here's a link: ${link}`,
            url: link,
          });
        } catch {
          Alert.alert(
            "Ask a Parent!",
            `Show this to a parent so they can get ${productName} for you!`
          );
        }
      }
    } else {
      // 13+: open Instacart directly
      await WebBrowser.openBrowserAsync(link);
    }
  }

  const label = isRestricted
    ? hasParent
      ? "Request This Snack!"
      : "Ask a Parent!"
    : "Buy on Instacart";

  const icon = isRestricted
    ? hasParent
      ? "notifications-outline"
      : "share-outline"
    : "cart-outline";

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-row items-center justify-center gap-2 rounded-2xl px-6 py-4 active:opacity-80 ${
        isRestricted ? "bg-tertiary" : "bg-secondary"
      }`}
    >
      <Ionicons name={icon} size={20} color="white" />
      <Text className="text-base font-bold text-white">{label}</Text>
    </Pressable>
  );
}
