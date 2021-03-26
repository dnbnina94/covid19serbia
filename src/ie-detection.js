const msieversion = () => {

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
        return true;
        // alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
    }
    // else  // If another browser, return 0
    // {
    //     // alert('otherbrowser');
    // }

    return false;
}

export default msieversion;