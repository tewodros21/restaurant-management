const BACKEND_URL = "http://127.0.0.1:8000";
const PLACEHOLDER = "https://via.placeholder.com/300x200?text=No+Image";

export const getImageUrl = (image) => {
  if (!image) return PLACEHOLDER;
  if (image.startsWith("http")) return image;
  return `${BACKEND_URL}${image}`;
};
