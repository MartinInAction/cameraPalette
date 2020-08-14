export let getColorNames = (hexes: string) => {
  return fetch(`https://api.color.pizza/v1/${hexes}?noduplicates=true`, {
    method: 'GET',
  });
};

export let getMultipleColorNames = (hex: string) => {
  return fetch(`https://api.color.pizza/v1/${hex}?noduplicates=true`, {
    method: 'GET',
  });
};
