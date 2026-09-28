document.addEventListener('DOMContentLoaded', function () {

    const languageToggleBtn = document.getElementById('languageToggleBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    const currentFlag = document.getElementById('currentFlag');
    const currentLanguage = document.getElementById('currentLanguage');
    const languageOptions = document.querySelectorAll('.language-option');


    // =====================================================
    // HIDE GOOGLE TRANSLATE WIDGET
    // =====================================================

    function hideGoogleTranslate() {

        const elements = [
            '.goog-te-banner-frame',
            '.goog-te-menu-value',
            '.skiptranslate',
            '.goog-te-banner'
        ];

        elements.forEach(function (selector) {

            const elementsFound =
                document.querySelectorAll(selector);

            elementsFound.forEach(function (element) {
                element.style.display = 'none';
            });

        });

        document.body.style.top = '0';
    }


    // =====================================================
    // LANGUAGE TOGGLE
    // =====================================================

    if (languageToggleBtn && languageDropdown) {

        languageToggleBtn.addEventListener('click', function (e) {

            e.stopPropagation();

            const isVisible =
                languageDropdown.style.display === 'block';

            languageDropdown.style.display =
                isVisible ? 'none' : 'block';

        });

    }


    // =====================================================
    // GOOGLE TRANSLATE FUNCTION
    // =====================================================

    function setGoogleTranslateLanguage(lang) {

        const select =
            document.querySelector('.goog-te-combo');

        if (!select) {
            return false;
        }

        // Set selected language
        select.value = lang;

        // Trigger Google Translate
        const event = new Event('change', {
            bubbles: true
        });

        select.dispatchEvent(event);

        return true;
    }


    // =====================================================
    // UPDATE CURRENT LANGUAGE DISPLAY
    // =====================================================

    function updateLanguageDisplay(lang) {

        let flagCode = 'se';
        let languageText = 'Swedish';

        if (lang === 'en') {

            flagCode = 'gb';
            languageText = 'English';

        } else if (lang === 'sv') {

            flagCode = 'se';
            languageText = 'Swedish';

        } else if (lang === 'ti') {

            flagCode = 'er';
            languageText = 'Tigrinya';

        }

        // Update flag
        if (currentFlag) {

            currentFlag.src =
                `https://flagcdn.com/w40/${flagCode}.png`;

        }

        // Update language text
        if (currentLanguage) {

            currentLanguage.textContent =
                languageText;

        }

    }


    // =====================================================
    // LANGUAGE OPTIONS CLICK
    // =====================================================

    languageOptions.forEach(function (option) {

        option.addEventListener('click', function (e) {

            e.stopPropagation();

            const lang =
                this.getAttribute('data-lang');

            const flagCode =
                this.getAttribute('data-flag');


            // ---------------------------------------------
            // Update current flag
            // ---------------------------------------------

            if (currentFlag && flagCode) {

                currentFlag.src =
                    `https://flagcdn.com/w40/${flagCode}.png`;

            }


            // ---------------------------------------------
            // Update current language text
            // ---------------------------------------------

            if (currentLanguage) {

                if (lang === 'en') {

                    currentLanguage.textContent =
                        'English';

                } else if (lang === 'sv') {

                    currentLanguage.textContent =
                        'Swedish';

                } else if (lang === 'ti') {

                    currentLanguage.textContent =
                        'Tigrinya';

                }

            }


            // ---------------------------------------------
            // Save selected language
            // ---------------------------------------------

            localStorage.setItem(
                'preferred-language',
                lang
            );


            // ---------------------------------------------
            // Close dropdown
            // ---------------------------------------------

            if (languageDropdown) {

                languageDropdown.style.display =
                    'none';

            }


            // ---------------------------------------------
            // Trigger Google Translate
            // ---------------------------------------------

            const translated =
                setGoogleTranslateLanguage(lang);


            // ---------------------------------------------
            // Reload function
            // ---------------------------------------------

            function reloadPage() {

                setTimeout(function () {

                    window.location.reload();

                }, 300);

            }


            // ---------------------------------------------
            // If Google Translate is already loaded
            // ---------------------------------------------

            if (translated) {

                reloadPage();

            }


            // ---------------------------------------------
            // If Google Translate is not loaded yet
            // Try again several times
            // ---------------------------------------------

            else {

                let attempts = 0;

                const retryTranslate =
                    setInterval(function () {

                        attempts++;

                        const success =
                            setGoogleTranslateLanguage(lang);


                        if (success || attempts >= 20) {

                            clearInterval(
                                retryTranslate
                            );

                            reloadPage();

                        }

                    }, 500);

            }

        });

    });


    // =====================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // =====================================================

    document.addEventListener('click', function () {

        if (languageDropdown) {

            languageDropdown.style.display =
                'none';

        }

    });


    // =====================================================
    // GET SAVED LANGUAGE
    // DEFAULT = SWEDISH
    // =====================================================

    const savedLang =
        localStorage.getItem('preferred-language') || 'sv';


    // =====================================================
    // UPDATE LANGUAGE DISPLAY ON PAGE LOAD
    // =====================================================

    updateLanguageDisplay(savedLang);


    // =====================================================
    // AUTOMATICALLY SET GOOGLE TRANSLATE LANGUAGE
    // =====================================================

    let translateAttempts = 0;

    const translateInterval =
        setInterval(function () {

            translateAttempts++;

            const success =
                setGoogleTranslateLanguage(savedLang);


            // Stop when Google Translate is ready
            // or after 30 attempts

            if (
                success ||
                translateAttempts >= 30
            ) {

                clearInterval(
                    translateInterval
                );

            }

        }, 500);


    // =====================================================
    // CONTINUOUSLY HIDE GOOGLE TRANSLATE ELEMENTS
    // =====================================================

    setInterval(
        hideGoogleTranslate,
        500
    );


    // =====================================================
    // INITIAL HIDE
    // =====================================================

    hideGoogleTranslate();

});