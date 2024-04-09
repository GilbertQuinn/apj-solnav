

function getImageURL(name) {
    return new URL(`../assets/logos/${name}`, import.meta.url).href
}

export { getImageURL }