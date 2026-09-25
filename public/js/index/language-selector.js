// Language switching and Google Translate integration.
    document.addEventListener('DOMContentLoaded', function() {
        const languageToggleBtn = document.getElementById('languageToggleBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        const currentFlag = document.getElementById('currentFlag');
        const currentLanguage = document.getElementById('currentLanguage');
        const languageOptions = document.querySelectorAll('.language-option');

        // Hide Google Translate widget
        function hideGoogleTranslate() {
            const elements = [
                '.goog-te-banner-frame',
                '.goog-te-menu-value',
                '.skiptranslate',
                '.goog-te-banner'
            ];

            elements.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.display = 'none';
                }
            });

            document.body.style.top = '0';
        }

        // Toggle dropdown
        languageToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = languageDropdown.style.display === 'block';
            languageDropdown.style.display = isVisible ? 'none' : 'block';
        });

        // Handle language change
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                const flagCode = this.getAttribute('data-flag');

                // Update current display
                currentFlag.src = `https://flagcdn.com/w40/${flagCode}.png`;
                currentLanguage.textContent = lang === 'en' ? 'English' : 'Swedish';

                // Trigger Google Translate
                const select = document.querySelector('.goog-te-combo');
                if (select) {
                    select.value = lang;
                    const event = new Event('change', {
                        bubbles: true
                    });
                    select.dispatchEvent(event);
                }

                // Hide dropdown
                languageDropdown.style.display = 'none';

                // Save to localStorage
                localStorage.setItem('preferred-language', lang);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            languageDropdown.style.display = 'none';
        });

        // Initialize with saved language
        const savedLang = localStorage.getItem('preferred-language') || 'en';
        const savedFlagCode = savedLang === 'en' ? 'gb' : 'se';
        const savedLanguageText = savedLang === 'en' ? 'English' : 'Swedish';

        currentFlag.src = `https://flagcdn.com/w40/${savedFlagCode}.png`;
        currentLanguage.textContent = savedLanguageText;

        // Set Google Translate to saved language
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = savedLang;
        }

        // Continuously hide Google Translate elements
        setInterval(hideGoogleTranslate, 500);

        // Initial hide
        hideGoogleTranslate();
    });
