/**
 * Placeholder for internal WebTeam UI components in external builds, copied
 * verbatim into generated stub packages during installation. It uses uncompiled
 * CommonJS and a Proxy to support arbitrary imports without a build step.
 */

'use strict';

var React = require('react');

function WebteamStub() {
    return React.createElement(
        'div',
        {
            'data-webteam-stub': true,
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px',
                padding: '24px',
                border: '1px dashed currentColor',
                borderRadius: '8px',
                backgroundColor: '#eee',
                opacity: 0.75,
            },
        },
        'Preview of the block is unavailable (webteam-ui)'
    );
}

// Named import, member access or call resolves to the placeholder
module.exports = new Proxy(WebteamStub, {
    get: function (target) {
        return target;
    },
});
