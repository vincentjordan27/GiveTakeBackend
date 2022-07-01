const routes = (handler) => [
  {
    method: 'POST',
    path: '/rewards',
    handler: handler.postRewardHandler,
  },
  {
    method: 'GET',
    path: '/rewards',
    handler: handler.getRewardsHandler,
  },
  {
    method: 'GET',
    path: '/reward/{id}',
    handler: handler.getRewardByIdHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/reward/admin/{id}',
    handler: handler.getRewardByIdAdminHandler,
  },
  {
    method: 'GET',
    path: '/myrewards',
    handler: handler.getMyRewardsHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/redeem/{id}',
    handler: handler.postRedeemHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'PATCH',
    path: '/reward/{id}',
    handler: handler.updateRewardHandler,
  },
  {
    method: 'GET',
    path: '/rewardreq',
    handler: handler.getRewardRequestHandler,
  },
  {
    method: 'POST',
    path: '/finishreward/{id}',
    handler: handler.postFinishRewardRequest,
  },
  {
    method: 'DELETE',
    path: '/reward/{id}',
    handler: handler.deleteRewardHandler,
  },
];

module.exports = routes;
