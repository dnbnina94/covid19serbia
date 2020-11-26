export const formatTitle = (t) => {
    let title = t.toLowerCase().split("_").join(" ");
    return title.charAt(0).toUpperCase() + title.slice(1);
}