import { StyleSheet } from "react-native";

export const productCardStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  popularContainer: {
    borderWidth: 2,
    borderColor: "#4A90E2",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#666666",
  },

  badge: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },

  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 16,
  },

  featuresContainer: {
    marginBottom: 20,
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  featureIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },

  featureText: {
    fontSize: 14,
    color: "#333333",
  },

  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  priceText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  periodText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 4,
  },

  purchaseButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  purchaseButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },

  purchaseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  trialText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 20,
  },
});
