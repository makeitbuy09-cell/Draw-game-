var PokiSDK = {
  init: () => Promise.resolve(),
  gameplayStart: () => {},
  gameplayStop: () => {},
  commercialBreak: cb => cb && cb()
};