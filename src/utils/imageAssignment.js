/**
 * 圖片分配工具函數
 * 用於根據心情為快照分配預設圖片
 */

// 心情與圖片對應關係
export const MOOD_IMAGE_MAP = {
  '平靜': ['平靜1.png', '平靜2.png', '平靜3.png'],
  '開心': ['開心1.jpg', '開心2.jpg', '開心3.jpg'],
  '興奮': ['興奮1.jpg', '興奮2.jpg', '興奮3.jpg'],
  '溫暖': ['溫暖1.jpg', '溫暖2.jpg', '溫暖3.jpg'],
  '焦慮但充滿希望': ['焦慮但充滿希望1.jpg', '焦慮但充滿希望2.jpg', '焦慮但充滿希望3.jpg'],
  '沮喪': ['沮喪1.jpg', '沮喪2.jpg', '沮喪3.jpg'],
  '其他': ['平靜1.png', '平靜2.png', '平靜3.png'] // 預設使用平靜圖片
};

/**
 * 根據心情分配圖片
 * @param {string} mood - 心情
 * @param {Object} usedImagesRef - 已使用圖片的記錄物件
 * @returns {string} 圖片路徑
 */
export const assignImageByMood = (mood, usedImagesRef) => {
  const availableImages = MOOD_IMAGE_MAP[mood] || MOOD_IMAGE_MAP['其他'];
  
  // 取得該心情已使用的圖片
  const usedForMood = usedImagesRef[mood] || [];
  
  // 找出未使用的圖片
  const unusedImages = availableImages.filter(img => !usedForMood.includes(img));
  
  let selectedImage;
  if (unusedImages.length > 0) {
    // 如果有未使用的圖片，隨機選擇一張
    selectedImage = unusedImages[Math.floor(Math.random() * unusedImages.length)];
  } else {
    // 如果所有圖片都用過了，重置並隨機選擇
    selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    // 重置該心情的使用記錄
    usedImagesRef[mood] = [selectedImage];
    return `https://storage.googleapis.com/checkpoint_frontend/素材/${selectedImage}`;
  }
  
  // 更新使用記錄
  usedImagesRef[mood] = [...(usedImagesRef[mood] || []), selectedImage];
  
  return `https://storage.googleapis.com/checkpoint_frontend/素材/${selectedImage}`;
};

/**
 * 獲取快照顯示的圖片
 * 優先使用用戶上傳的圖片，其次使用分配的預設圖片
 * @param {Object} snapshot - 快照物件
 * @returns {string} 圖片路徑
 */
export const getSnapshotDisplayImage = (snapshot) => {
  // 優先使用用戶上傳的圖片
  if (snapshot.image_url) {
    return snapshot.image_url;
  }
  
  // 其次使用分配的預設圖片
  if (snapshot.assigned_image) {
    return snapshot.assigned_image;
  }
  
  // 如果都沒有，根據心情返回預設圖片
  const availableImages = MOOD_IMAGE_MAP[snapshot.mood] || MOOD_IMAGE_MAP['其他'];
  const defaultImage = availableImages[0];
  return `https://storage.googleapis.com/checkpoint_frontend/素材/${defaultImage}`;
};


//更新阿