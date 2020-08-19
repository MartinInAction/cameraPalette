export default function (hexes: Array<string>) {
  hexes = hexes.map((hex) => hex.replace('#', '')).toString();
  return fetch(`https://api.color.pizza/v1/${hexes}?noduplicates=true`, {
    method: 'GET',
  }).then((res) => res.json());
}
