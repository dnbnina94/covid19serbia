export const formatTitle = (t) => {
    let title = t.toLowerCase().split("_").join(" ");
    return title.charAt(0).toUpperCase() + title.slice(1);
}

export const capitalize = (d) => {
    let retStr = d.toLowerCase().split(" ").map(d => {
        return d.charAt(0).toUpperCase() + d.slice(1);
    });
    return retStr.join(" ");
}