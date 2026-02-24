document.addEventListener('DOMContentLoaded', () => {
    
    // 1. شريط الإعلان (Banner) والهيدر (Header) وتنسيق الخطوط
    const saleEndDate = new Date('2026-07-20');
    const isHomePage = document.body.classList.contains('homepage');

    if (new Date() < saleEndDate) {
        if (!document.querySelector('.global-sale-banner')) {
            const banner = document.createElement('div');
            
            const baseBannerStyle = `
                height: 30px; 
                display: flex;
                align-items: center;
                overflow: hidden;
                width: 100%; 
                z-index: 10001;
                font-family: sans-serif;
                white-space: nowrap;
                left: 0;
                position: absolute; 
                top: 0;
            `;

            if (isHomePage) {
                banner.style.cssText = baseBannerStyle + `
                    background: rgba(255, 255, 255, 0.1); 
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                `;
            } else {
                banner.style.cssText = baseBannerStyle + `
                    background: black; 
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                `;
            }
            
            const content = "🔥 20% OFF for Limtied Time  🔥 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ";
            banner.innerHTML = `
                <div class="scrolling-content" style="display: inline-block; font-size: 11px; font-weight: bold; color: white; text-transform: uppercase; animation: marquee 20s linear infinite;">
                    ${content.repeat(10)}
                </div>
            `;
            
            banner.classList.add('global-sale-banner');
            document.body.prepend(banner);

            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                
                body:not(.homepage), body:not(.homepage) button, body:not(.homepage) p {
                    font-family: 'Cormorant Garamond', serif !important;
                }
                
                #product-details-content, .info-item p, .product-description {
                    font-size: 18px !important;
                    line-height: 1.6 !important;
                    color: #333 !important;
                }

                body:not(.homepage) h1, .logo, .new-price {
                    font-family: 'Bodoni Moda', serif !important;
                }

                .header {
                    position: absolute !important;
                    top: 30px !important;
                    width: 100% !important;
                    z-index: 10000 !important;
                    display: flex !important;
                    align-items: center !important;
                    transition: none !important;
                }

                ${isHomePage ? `
                    body.homepage .header {
                        background: transparent !important;
                        padding: 20px 5% !important;
                    }
                ` : `
                    body:not(.homepage) .header {
                        background: black !important;
                        padding: 10px 5% !important;
                        height: 55px !important;
                    }
                    .product-page-container {
                        padding-top: 110px !important;
                    }
                `}

                .logo { font-size: 22px !important; letter-spacing: 2px; }

                .modal-overlay {
                    display: none; 
                    position: fixed; 
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7); 
                    z-index: 20000; 
                    align-items: center; 
                    justify-content: center;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    background: white;
                    padding: 30px;
                    width: 90%;
                    max-width: 500px;
                    position: relative;
                    border-radius: 5px;
                }
                .close-modal {
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    font-size: 24px;
                    cursor: pointer;
                    color: #000;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 2. المنيو والغطاء (Side Menu)
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.getElementById('close-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    const closeMenu = () => {
        sideMenu?.classList.remove('active');
        menuOverlay?.classList.remove('active');
    };
    if (menuToggle) menuToggle.onclick = () => {
        sideMenu?.classList.add('active');
        menuOverlay?.classList.add('active');
    };
    if (closeBtn) closeBtn.onclick = closeMenu;
    if (menuOverlay) menuOverlay.onclick = closeMenu;

    // --- 3. السلة والأنيميشن الذكي المطور (تم التعديل هنا) ---
    const updateCartBadge = () => {
        const cartCount = document.getElementById('cart-count');
        const cart = JSON.parse(localStorage.getItem('sitaCart')) || [];
        if (cartCount) cartCount.innerText = cart.length;
    };
    updateCartBadge();
    
    // إظهار السكشن الأول فوراً (Polo Section) ليتزامن مع الرفرش والريفيل
    const firstSection = document.querySelector('.pants-collection');
    if (firstSection) {
        // تأخير بسيط جداً لضمان تناسقه مع أنيميشن الهيرو (0.5 ثانية)
        setTimeout(() => {
            firstSection.classList.add('is-visible'); 
        }, 500);
    }

    // الـ Observer للسكاشن اللي تحت التي تحمل كلاس reveal-on-scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target); 
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px" 
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(section => {
        revealObserver.observe(section);
    });

    // سيستم الخصومات
    window.applyDiscounts = () => {
        const containers = document.querySelectorAll('.product-card, .related-products a, .product-item');
        containers.forEach(container => {
            const priceTag = container.querySelector('.price');
            if (!priceTag || priceTag.getAttribute('data-applied') === 'true') return;

            let rawText = priceTag.innerText.replace(/[^\d]/g, ' ').trim(); 
            let numbers = rawText.split(/\s+/).filter(n => n.length > 0);
            
            if (numbers.length > 0) {
                let originalPrice = parseInt(numbers[0]);
                let discount = (originalPrice >= 1300) ? 300 : (originalPrice >= 700 ? 100 : 0);
                let discountedPrice = originalPrice - discount;

                priceTag.style.cssText = `
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: flex-start !important;
                    justify-content: flex-start !important;
                    gap: 1px !important;
                    margin-top: 5px !important;
                    text-align: left !important;
                    width: 100% !important;
                    padding-left: 2px !important;
                `;
                
                priceTag.innerHTML = `
                    <span style="text-decoration: line-through; color: #999; font-size: 10px; font-weight: normal; line-height: 1.1;">${originalPrice} EGP</span>
                    <span style="color: #b12704; font-weight: bold; font-size: 13px; line-height: 1.1;">${discountedPrice} EGP</span>
                `;
                priceTag.setAttribute('data-applied', 'true');
            }
        });
    };
    setTimeout(() => { if (window.applyDiscounts) window.applyDiscounts(); }, 150);  

    // 4. وظائف البوب-أب للبوليسي والسايز شارت
    window.openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    window.onclick = (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            event.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // 6. نقل البيانات وتحديد الصفحة المستهدفة
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card:not([style*="display: none"]), .product-item, .related-products a');
        if (card && !e.target.closest('.cart-icon')) {
            e.preventDefault();
            const name = card.querySelector('h3, div[style*="font-weight: 700"]')?.innerText || card.querySelector('div[style*="font-weight: 600"]')?.innerText;
            const imgFull = card.querySelector('img').src;
            const imgName = imgFull.split('/').pop(); 
            
            const priceElement = card.querySelector('.price');
            const oldPriceSpan = priceElement.querySelector('span[style*="line-through"]');
            
            let priceValue = oldPriceSpan ? oldPriceSpan.innerText.replace(/[^\d]/g, '') : priceElement.innerText.replace(/[^\d]/g, '').trim();

            window.location.href = `product-details.html?name=${encodeURIComponent(name)}&price=${encodeURIComponent(priceValue)}&img=${encodeURIComponent(imgName)}`;
        }
    });
});