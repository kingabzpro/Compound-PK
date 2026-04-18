import type { ImageMetadata } from "astro";

import aboutAuthor from "@/assets/content/authors/abid-ali-awan-about.jpg";
import authorPng from "@/assets/content/authors/abid-ali-awan.png";
import authorProfile from "@/assets/content/authors/abid-ali-awan-profile.jpg";
import image01 from "@/assets/content/posts/01.jpg";
import image02 from "@/assets/content/posts/02.jpg";
import image03 from "@/assets/content/posts/03.jpg";
import image04 from "@/assets/content/posts/04.jpg";
import image05 from "@/assets/content/posts/05.jpg";
import image06 from "@/assets/content/posts/06.jpg";
import image07 from "@/assets/content/posts/07.jpg";
import assetManagementCompanies from "@/assets/content/posts/asset-management-companies-pakistan-retail-mutual-funds.jpg";
import beforeInvesting from "@/assets/content/posts/before-investing-pakistan-long-term-checklist.jpg";
import brokeragePlatforms from "@/assets/content/posts/brokerage-platforms-pakistan-retail-investing.jpg";
import forexCfdBrokers from "@/assets/content/posts/forex-cfd-brokers-pakistan-comparison.jpg";
import globalEtfs from "@/assets/content/posts/global-etfs-from-pakistan-playbook.jpg";
import insuranceCompanies from "@/assets/content/posts/insurance-companies-pakistan-conventional-comparison.png";
import internationalWallets from "@/assets/content/posts/international-wallets-cross-border-accounts-pakistan.jpg";
import investorAttention from "@/assets/content/posts/latest-research-investor-attention-short-termism.jpg";
import microfinanceBanks from "@/assets/content/posts/top-microfinance-banks-pakistan.png";
import mobileWallets from "@/assets/content/posts/top-mobile-wallets-pakistan.png";
import multiAssetBrokers from "@/assets/content/posts/multi-asset-brokers-us-stocks-etfs-options-pakistan.jpg";
import nationalSavings from "@/assets/content/posts/national-savings-pakistan-government-backed-retail-savings.jpg";
import paymentGateways from "@/assets/content/posts/payment-gateways-pakistan-online-merchants.jpg";
import paymentInfrastructure from "@/assets/content/posts/payment-infrastructure-pakistan-retail-rails.jpg";
import remittanceApps from "@/assets/content/posts/remittance-apps-send-money-to-pakistan.jpg";
import takafulCompanies from "@/assets/content/posts/takaful-companies-pakistan-islamic-insurance-comparison.jpg";
import topBanks from "@/assets/content/posts/top-banks-pakistan.jpg";
import topIslamicBanks from "@/assets/content/posts/top-islamic-banks-pakistan.png";

export type ContentImage = ImageMetadata | string | null | undefined;

const localImageMap: Record<string, ImageMetadata> = {
  "/images/authors/abid-ali-awan-about.jpg": aboutAuthor,
  "/images/authors/abid-ali-awan-profile.jpg": authorProfile,
  "/images/authors/abid-ali-awan.png": authorPng,
  "/images/posts/01.jpg": image01,
  "/images/posts/02.jpg": image02,
  "/images/posts/03.jpg": image03,
  "/images/posts/04.jpg": image04,
  "/images/posts/05.jpg": image05,
  "/images/posts/06.jpg": image06,
  "/images/posts/07.jpg": image07,
  "/images/posts/asset-management-companies-pakistan-retail-mutual-funds.jpg":
    assetManagementCompanies,
  "/images/posts/before-investing-pakistan-long-term-checklist.jpg":
    beforeInvesting,
  "/images/posts/brokerage-platforms-pakistan-retail-investing.jpg":
    brokeragePlatforms,
  "/images/posts/forex-cfd-brokers-pakistan-comparison.jpg": forexCfdBrokers,
  "/images/posts/global-etfs-from-pakistan-playbook.jpg": globalEtfs,
  "/images/posts/insurance-companies-pakistan-conventional-comparison.png":
    insuranceCompanies,
  "/images/posts/international-wallets-cross-border-accounts-pakistan.jpg":
    internationalWallets,
  "/images/posts/latest-research-investor-attention-short-termism.jpg":
    investorAttention,
  "/images/posts/top-microfinance-banks-pakistan.png": microfinanceBanks,
  "/images/posts/top-mobile-wallets-pakistan.png": mobileWallets,
  "/images/posts/multi-asset-brokers-us-stocks-etfs-options-pakistan.jpg":
    multiAssetBrokers,
  "/images/posts/national-savings-pakistan-government-backed-retail-savings.jpg":
    nationalSavings,
  "/images/posts/payment-gateways-pakistan-online-merchants.jpg":
    paymentGateways,
  "/images/posts/payment-infrastructure-pakistan-retail-rails.jpg":
    paymentInfrastructure,
  "/images/posts/remittance-apps-send-money-to-pakistan.jpg": remittanceApps,
  "/images/posts/takaful-companies-pakistan-islamic-insurance-comparison.jpg":
    takafulCompanies,
  "/images/posts/top-banks-pakistan.jpg": topBanks,
  "/images/posts/top-islamic-banks-pakistan.png": topIslamicBanks,
};

export const resolveContentImage = (
  image: ContentImage,
): ImageMetadata | string | undefined => {
  if (!image) return undefined;
  if (typeof image === "string") return localImageMap[image] ?? image;
  return image;
};

export const resolveLocalContentImage = (
  image: ContentImage,
): ImageMetadata | undefined => {
  const resolvedImage = resolveContentImage(image);
  return resolvedImage && typeof resolvedImage !== "string"
    ? resolvedImage
    : undefined;
};

export const getOptimizedImageProps = (
  image: ContentImage,
): { src: ImageMetadata; format: ImageMetadata["format"]; quality: number } | undefined => {
  const resolvedImage = resolveLocalContentImage(image);
  if (!resolvedImage) return undefined;

  return {
    src: resolvedImage,
    format: resolvedImage.format,
    quality: 100,
  };
};

export const resolveContentImageUrl = (
  image: ContentImage,
): string | undefined => {
  const resolvedImage = resolveContentImage(image);
  if (!resolvedImage) return undefined;
  return typeof resolvedImage === "string" ? resolvedImage : resolvedImage.src;
};
