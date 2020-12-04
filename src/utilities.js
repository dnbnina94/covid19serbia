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

export const formatDate = (date) => {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(date);

    return `${day}.${month}.${year}.`;
}

export const formatTime = (date) => {
    const hours = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false }).format(date);
    const minutes = new Intl.DateTimeFormat('en', { minute: 'numeric'}).format(date);
    return `${hours}:${minutes}`;
}

export const dateToString = (date) => {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(date);

    return `${year}-${month}-${day}`;
}