/**
 * Created by hadihariri on 21/11/13.
 */
function generateTOC(insertBefore, heading) {
    var container = jQuery("<div id='tocBlock' class='navigation'></div>");
    var ul = jQuery("<ul id='toc'></ul>");
    var content = $(insertBefore).first();
    if (heading != undefined && heading != null) {
        container.append('<span class="tocHeading">' + heading + '</span>');
    }
    ul.tableOfContents(content);
    container.append(ul);
    container.insertBefore(insertBefore);
}


