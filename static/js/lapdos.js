document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Toggle Logic
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        // Load state from localStorage
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
        }
        
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
    }

    // Add classes to allauth form inputs
    const authForms = document.querySelectorAll('form');
    authForms.forEach(form => {
        const inputs = form.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
        inputs.forEach(input => {
            if (!input.classList.contains('form-input')) {
                input.classList.add('form-input');
            }
        });
    });

    // 2. Mobile Menu Logic
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenuClose && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('open');
        });
        
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    }

    // 3. Blog Filter Logic
    const filterSection = document.getElementById('filterSection');
    if (filterSection) {
        const filterBtns = filterSection.querySelectorAll('.filter-btn');
        const blogCards = filterSection.querySelectorAll('.blog-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                
                blogCards.forEach(card => {
                    if (filter === 'all' || card.dataset.type === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 4. File Upload UI (Blogs)
    const coverImageInput = document.getElementById('id_cover_image');
    if (coverImageInput) {
        coverImageInput.addEventListener('change', function(e) {
            const label = this.closest('.file-upload-label');
            if (label && this.files.length > 0) {
                const textEl = label.querySelector('.file-upload-text');
                const iconEl = label.querySelector('.file-upload-icon');
                if (textEl) textEl.textContent = '✅ ' + this.files[0].name;
                if (iconEl) iconEl.textContent = '🖼️';
            }
        });
    }

    // 5. AI Assistant Logic
    const aiTabs = document.getElementById('aiTabs');
    if (aiTabs) {
        const tabBtns = aiTabs.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.style.display = 'none');
                
                btn.classList.add('active');
                const targetTab = document.getElementById('tab' + btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1));
                if (targetTab) {
                    targetTab.style.display = 'block';
                    if (targetTab.id === 'tabChat') {
                        scrollToBottom();
                    }
                }
            });
        });

        // Chat logic
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');
        const chatbox = document.getElementById('chatbox');
        const chatLoading = document.getElementById('chatLoading');
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        
        let chatHistory = [];
        let isChatLoading = false;

        function scrollToBottom() {
            if (chatbox) chatbox.scrollTop = chatbox.scrollHeight;
        }

        function appendMessage(role, content) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${role}`;
            
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${role}`;
            bubble.textContent = content;
            
            msgDiv.appendChild(bubble);
            chatbox.insertBefore(msgDiv, chatLoading);
            scrollToBottom();
        }

        async function sendMessage(text) {
            const msg = text || (chatInput ? chatInput.value.trim() : '');
            if (!msg || isChatLoading) return;
            
            appendMessage('user', msg);
            chatHistory.push({ role: 'user', content: msg });
            
            if (chatInput) chatInput.value = '';
            
            isChatLoading = true;
            if (chatLoading) chatLoading.style.display = 'flex';
            if (chatSend) chatSend.disabled = true;
            scrollToBottom();
            
            try {
                // window.AI_CHAT_URL is set in chat.html
                const res = await fetch(window.AI_CHAT_URL || "/ai/chat/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                    body: JSON.stringify({
                        message: msg,
                        history: chatHistory.slice(0, -1)
                    })
                });
                
                const data = await res.json();
                appendMessage('assistant', data.reply);
                chatHistory.push({ role: 'assistant', content: data.reply });
            } catch (err) {
                console.error(err);
                appendMessage('assistant', 'Sorry, an error occurred.');
            } finally {
                isChatLoading = false;
                if (chatLoading) chatLoading.style.display = 'none';
                if (chatSend) chatSend.disabled = false;
                scrollToBottom();
            }
        }

        if (chatSend && chatInput) {
            chatSend.addEventListener('click', () => sendMessage());
            chatInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }

        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sendMessage(btn.textContent);
            });
        });

        // Image Analyzer Logic
        const dropZone = document.getElementById('dropZone');
        const imgInput = document.getElementById('imgInput');
        const previewArea = document.getElementById('previewArea');
        const previewImg = document.getElementById('previewImg');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const analyzeText = document.getElementById('analyzeText');
        const imageResult = document.getElementById('imageResult');
        
        let imageFile = null;

        function handleFile(file) {
            if (!file) return;
            imageFile = file;
            previewImg.src = URL.createObjectURL(file);
            previewArea.style.display = 'flex';
            if (imageResult) imageResult.style.display = 'none';
            if (imageResult) imageResult.textContent = '';
        }

        if (dropZone && imgInput) {
            dropZone.addEventListener('click', () => imgInput.click());
            imgInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
            
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.style.borderColor = 'var(--primary)';
            });
            dropZone.addEventListener('dragleave', () => {
                dropZone.style.borderColor = 'var(--border)';
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.style.borderColor = 'var(--border)';
                if (e.dataTransfer.files.length) {
                    handleFile(e.dataTransfer.files[0]);
                }
            });
        }

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', async () => {
                if (!imageFile || isChatLoading) return;
                
                isChatLoading = true;
                analyzeBtn.disabled = true;
                if (analyzeText) analyzeText.textContent = 'Analyzing with AI...';
                if (imageResult) imageResult.style.display = 'none';
                
                const fd = new FormData();
                fd.append("image", imageFile);
                fd.append("csrfmiddlewaretoken", getCookie("csrftoken"));
                
                try {
                    const res = await fetch(window.AI_ANALYZE_URL || "/ai/analyze/", {
                        method: "POST",
                        body: fd
                    });
                    const data = await res.json();
                    
                    if (imageResult) {
                        imageResult.textContent = data.result || data.error;
                        imageResult.style.display = 'block';
                    }
                } catch (err) {
                    console.error(err);
                    if (imageResult) {
                        imageResult.textContent = "Error analyzing image.";
                        imageResult.style.display = 'block';
                    }
                } finally {
                    isChatLoading = false;
                    analyzeBtn.disabled = false;
                    if (analyzeText) analyzeText.textContent = '🔍 Analyze for Doping Agents';
                }
            });
        }
    }

    // Helper to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // ================================================================
    // 6. Dark Mode Toggle — Design.md §7
    // ================================================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Restore saved preference
    const savedTheme = localStorage.getItem('lapdos-theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('lapdos-theme', isDark ? 'dark' : 'light');
        });
    }

    // ================================================================
    // 7. GSAP Page Entry Animations — Design.md §5.4
    // ================================================================
    if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Glass card entry animations
        const glassCards = document.querySelectorAll('.glass-card, .feature-card, .stat-card, .module-card, .blog-card');
        if (glassCards.length > 0) {
            gsap.from(glassCards, {
                opacity: 0,
                y: 40,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: typeof ScrollTrigger !== 'undefined' ? {
                    trigger: glassCards[0],
                    start: 'top 85%',
                } : undefined,
            });
        }

        // Removed sidebar nav item entry animation to prevent conflicts with CSS transitions
        // and active states which caused items to disappear.

        // Number counter animation for stat cards — Design.md §5.4
        const statValues = document.querySelectorAll('.stat-value, .stat-number, [data-count]');
        statValues.forEach(el => {
            const targetValue = parseInt(el.textContent, 10) || parseInt(el.dataset.count, 10);
            if (!isNaN(targetValue) && targetValue > 0) {
                const obj = { value: 0 };
                gsap.to(obj, {
                    value: targetValue,
                    duration: 1.5,
                    ease: 'power1.out',
                    snap: { value: 1 },
                    scrollTrigger: typeof ScrollTrigger !== 'undefined' ? {
                        trigger: el,
                        start: 'top 85%',
                    } : undefined,
                    onUpdate: () => {
                        el.textContent = Math.round(obj.value);
                    }
                });
            }
        });
    }

    // ================================================================
    // 8. VanillaTilt — Design.md §5.2 (Tilt Effect — Stat Cards)
    // ================================================================
    if (typeof VanillaTilt !== 'undefined') {
        // Enhanced config from Design.md: max:15, speed:400, glare with lime tint
        const tiltElements = document.querySelectorAll('.stat-card, [data-tilt]');
        if (tiltElements.length > 0) {
            VanillaTilt.init(tiltElements, {
                max: 15,
                speed: 400,
                glare: true,
                'max-glare': 0.3,
            });
        }
    }

    // ================================================================
    // 9. tsParticles Hero Section — Design.md §5.3
    // ================================================================
    const particlesContainer = document.getElementById('particles-hero');
    if (particlesContainer && typeof tsParticles !== 'undefined') {
        // Adjust particle count for mobile — Design.md §6
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 0 : 60;

        if (particleCount > 0) {
            tsParticles.load('particles-hero', {
                fullScreen: false,
                particles: {
                    number: { value: particleCount },
                    color: { value: ['#CCF56A', '#A5D13B'] },
                    shape: { type: 'circle' },
                    opacity: { value: 0.6, random: true },
                    size: { value: 3, random: true },
                    links: {
                        enable: true,
                        distance: 120,
                        color: '#CCF56A',
                        opacity: 0.3,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        speed: 1.2,
                        direction: 'top',
                        outModes: { default: 'out' },
                    },
                },
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: 'repulse',
                        },
                    },
                    modes: {
                        repulse: {
                            distance: 80,
                            duration: 0.4,
                        },
                    },
                },
                detectRetina: true,
            });
        }
    }

    // ================================================================
    // 10. Accessible Focus States — Design.md §6 (Frontend Roadmap)
    // ================================================================
    // Ensure all interactive elements show focus ring on keyboard nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });

    console.log("LAPDOS v2.0 — All Systems Loaded");
});
