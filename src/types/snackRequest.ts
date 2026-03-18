export interface SnackRequest {
  id: string;
  snackId: string;
  snackName: string;
  snackBrand: string;
  snackImageUrl: string | null;
  requestedByProfileId: string;
  requestedByName: string;
  parentProfileId: string;
  status: "pending" | "approved" | "dismissed";
  createdAt: number;
}
