function closePopup() {
    document.querySelector('.app-feedback-popup').classList.add('app-feedback-popup_close');
}

function showThanks() {
    document.querySelector('.feedback__block--active').classList.remove('feedback__block--active');
    document.querySelector('[data-test="feedback-left"]').classList.add('feedback__block--active');
}

function toggleEmail(val) {
    const email = document.querySelector('[data-test-id="feedback-email"]');
    email.setAttribute('aria-invalid', String(!val));

    const classes = email.parentNode.parentNode.parentNode.parentNode.classList;
    classes.toggle('_error_1fowpgw_83', !val);
    classes.toggle('input_error', !val);
}

function toggleSubmit(val) {
    const submit = document.querySelector('[data-test="feedback-send"]');
    submit.toggleAttribute('disabled', !val);

    const classes = submit.classList;
    classes.toggle('_disabled_joawza_61', !val);
    classes.toggle('button_disabled', !val);
}

export function initFeedback() {
    const feedback = document.querySelector('.feedback');

    if (feedback) {
        feedback.querySelector('[data-test="feedback-yes"]').addEventListener('click', function(e) {
            e.preventDefault();
            closePopup();
            showThanks();
        });

        feedback.querySelector('[data-test="feedback-no"]').addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.app-feedback-popup').classList.remove('app-feedback-popup_close');
        });
    }

    const form = document.querySelector('.app-feedback-popup form');

    if (form) {
        const fields = form.elements;

        form.querySelector('[data-test="feedback-close"]').addEventListener('click', function(e) {
            e.preventDefault();
            closePopup();
        });

        form.addEventListener('input', function() {
            const emailValid = fields.email.value === '' || fields.email.validity.valid;

            toggleEmail(emailValid);
            toggleSubmit(fields.content.value !== '' && emailValid);
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            window.fetch('https://forms-service.jetbrains.com/feedback', {
                'method': 'POST',
                'mode': 'cors',
                'credentials': 'omit',
                'body': JSON.stringify({
                    content: fields.content.value || '',
                    name: fields.name.value || '',
                    email: fields.email.value || '',
                    url: document.location.href || ''
                })
            });

            showThanks();
            closePopup();
        });
    }
}
