const countDistance = (latitude1, longitude1, latitude2, longitude2) => {
  const R = 6371;
  const dLat = ((latitude2 - latitude1) * Math.PI) / 180;
  const dLon = ((longitude2 - longitude1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos((latitude1 * Math.PI) / 180)
            * Math.cos((latitude2 * Math.PI) / 180)
            * Math.sin(dLon / 2)
            * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d.toFixed(4);
};

const mapCountDistance = (latitude1, longitude1, latitude2, longitude2) => countDistance(
  parseFloat(latitude1),
  parseFloat(longitude1),
  parseFloat(latitude2),
  parseFloat(longitude2),
);

const mapDBToItem = ({
  id, name, user_id, max_radius, description, category,
}) => ({
  id,
  name,
  radius: '-',
  userId: user_id,
  maxRadius: max_radius,
  desc: description,
  category,
});

const mapDbtoItemLogin = (user, item) => ({
  id: item.id,
  name: item.name,
  distance: String(mapCountDistance(user.latitude, user.longitude, item.latitude, item.longitude)),
  maxRadius: item.max_radius,
  userId: item.user_id,
  desc: item.description,
  category: item.category,
  thumbnail: item.thumbnail,
});

const mapDBToItemById = (items, request, requestId, wishlist, name, token, address, latitude, longitude, images, ulasanImage) => ({
  request,
  requestId,
  wish: wishlist,
  name,
  token,
  address,
  latitude,
  longitude,
  items,
  images,
  ulasanImage,
});

const mapDBToReceiverList = ({
  itemId, status, userId, name, latitude, longitude, uLatitude, uLongitude, requestId, reason, photo,
}) => ({
  itemId,
  status,
  userId,
  name,
  distance: String(mapCountDistance(latitude, longitude, uLatitude, uLongitude)),
  requestId,
  reason,
  photo,
});

module.exports = {
  mapCountDistance, mapDBToItem, mapDbtoItemLogin, mapDBToItemById, mapDBToReceiverList,
};
