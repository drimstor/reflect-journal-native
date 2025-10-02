import { StyleSheet } from "react-native";

export const subscriptionWidgetStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  header: {
    padding: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },

  scrollContainer: {
    flex: 1,
  },

  productsContainer: {
    paddingBottom: 20,
  },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },

  restoreButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4A90E2",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  restoreButtonText: {
    color: "#4A90E2",
    fontSize: 16,
    fontWeight: "500",
  },

  termsText: {
    fontSize: 12,
    color: "#999999",
    textAlign: "center",
    lineHeight: 18,
  },

  termsLink: {
    textDecorationLine: "underline",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  loadingText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 16,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E74C3C",
    marginBottom: 8,
    textAlign: "center",
  },

  errorMessage: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },

  emptyMessage: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
});
