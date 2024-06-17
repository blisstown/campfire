const denoms = [
    { unit: 's', min: 0 },
    { unit: 'm', min: 60 },
    { unit: 'h', min: 60 },
    { unit: 'd', min: 24 },
    { unit: 'w', min: 7 },
    { unit: 'y', min: 52 },
];

export function shorthand(date) {
    let value = (new Date() - date) / 1000;
    let unit = 's';
    let index = 0;
    while (index < denoms.length - 1) {
        if (value < denoms[index + 1].min) break;
        index++
        value /= denoms[index].min;
        unit = denoms[index].unit;
    }
    if (value > 0)
        return Math.floor(value) + unit + " ago";
    return "in " + Math.floor(value) + unit;
}
