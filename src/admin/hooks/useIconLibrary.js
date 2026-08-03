import { useFirestoreCollection } from "./useFirestoreCollection";

/**
 * Custom hook to interface with the single shared Centralized Icon Library (icons/).
 */
export function useIconLibrary() {
  const { data: icons, loading, error, addItem, updateItem, deleteItem } = useFirestoreCollection("icons", "name");

  const getIcon = (iconId) => {
    if (!iconId) return null;
    return icons.find((i) => i.id === iconId || i.id === iconId.toLowerCase()) || null;
  };

  const getIconUrl = (iconId, defaultFallback = "") => {
    const iconObj = getIcon(iconId);
    if (iconObj && iconObj.url) return iconObj.url;
    return defaultFallback;
  };

  return {
    icons,
    loading,
    error,
    getIcon,
    getIconUrl,
    addIcon: addItem,
    updateIcon: updateItem,
    deleteIcon: deleteItem,
  };
}
