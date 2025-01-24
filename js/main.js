// main.js

document.addEventListener('DOMContentLoaded', () => {
    // 카운트다운 타이머 초기화
    initializeCountdowns();
    // 스크롤 애니메이션 초기화
    initializeScrollAnimations();
    // 카카오 채널 초기화
    initializeKakaoChannel();
});

// 방송 카운트다운 기능
function initializeCountdowns() {
    const countdowns = document.querySelectorAll('.countdown');
    
    function updateCountdowns() {
        countdowns.forEach(countdown => {
            const day = parseInt(countdown.dataset.day); // 0 = 일요일, 1 = 월요일, ...
            const hour = parseInt(countdown.dataset.hour);
            
            const now = new Date();
            const nextShow = getNextShowTime(day, hour);
            const timeLeft = nextShow - now;
            
            // 남은 시간 계산
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            // 방송 시간 1시간 이내일 때
            if (timeLeft < 1000 * 60 * 60) {
                countdown.innerHTML = `<span class="live-soon">곧 방송 시작!</span>`;
                countdown.classList.add('live-countdown');
            } else {
                countdown.innerHTML = `다음 방송까지 ${days}일 ${hours}시간 ${minutes}분`;
            }
        });
    }

    // 다음 방송 시간 계산
    function getNextShowTime(targetDay, targetHour) {
        const now = new Date();
        let nextShow = new Date();
        nextShow.setHours(targetHour, 0, 0, 0);
        
        // 요일 맞추기
        let daysUntilShow = targetDay - now.getDay();
        if (daysUntilShow < 0 || (daysUntilShow === 0 && now.getHours() >= targetHour)) {
            daysUntilShow += 7;
        }
        
        nextShow.setDate(nextShow.getDate() + daysUntilShow);
        return nextShow;
    }

    // 1분마다 카운트다운 업데이트
    updateCountdowns();
    setInterval(updateCountdowns, 60000);
}

// 스크롤 애니메이션
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 한 번만 애니메이션 실행
            }
        });
    }, observerOptions);

    // 애니메이션 대상 요소들
    const animateElements = document.querySelectorAll('.program-card, .quick-link-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// 카카오 채널 추가 기능
function initializeKakaoChannel() {
    // 카카오 SDK가 로드되었는지 확인
    if (window.Kakao) {
        // 자신의 카카오 JavaScript 키로 초기화
        if (!Kakao.isInitialized()) {
            Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY');
        }

        const kakaoButton = document.getElementById('kakao-channel-btn');
        if (kakaoButton) {
            kakaoButton.addEventListener('click', (e) => {
                e.preventDefault();
                Kakao.Channel.addChannel({
                    channelPublicId: '_YOUR_CHANNEL_ID' // 자신의 카카오 채널 ID
                });
            });
        }
    }
}

// 스크롤 시 헤더 스타일 변경
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 모바일 메뉴 토글
const setupMobileMenu = () => {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<span class="hamburger"></span>';
    
    const nav = document.querySelector('.main-nav');
    nav.prepend(menuToggle);

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('menu-open');
    });
};

// 페이지 로드 완료 후 모바일 메뉴 설정
if (window.innerWidth < 768) {
    setupMobileMenu();
}

// 브라우저 리사이즈 대응
window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        if (!document.querySelector('.menu-toggle')) {
            setupMobileMenu();
        }
    } else {
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.remove();
        }
        document.querySelector('.main-nav')?.classList.remove('menu-open');
    }
});

// 이미지 레이지 로딩
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 페이지 성능 모니터링
function monitorPagePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`페이지 로드 시간: ${pageLoadTime}ms`);
        });
    }
}

// 에러 처리
window.addEventListener('error', (e) => {
    console.error('JavaScript 에러:', e.message);
    // 필요한 경우 사용자에게 에러 알림
});

// 설날 main.js 시작
 
// 방송사별 온에어 링크
const BROADCAST_LINKS = {
    KBS: "https://naver.me/FWJUsmCX",
    MBC: "https://naver.me/xXrv590N",
    SBS: "https://naver.me/FJHYQIPf",
    JTBC: "https://naver.me/IFKhECD1",
    TV_CHOSUN: "https://naver.me/5FhmQnMU",
    MBN: "https://naver.me/GrA3Ec3W"
};

// 영화/공연 데이터
const holidayMovies = {
    "2025-01-27": [
        {
            time: "10:45",
            title: "리바운드",
            channel: "MBC",
            imageUrl: "[이미지URL]",
            category: "영화"
        },
        {
            time: "17:15",
            title: "콘크리트 유토피아",
            channel: "SBS",
            imageUrl: "[이미지URL]",
            category: "영화"
        },
        // ... 다른 영화들
    ],
    // ... 다른 날짜들
};

// 방송사 온에어 링크 가져오기 함수
function getOnAirLink(channel) {
    // KBS1, KBS2는 모두 KBS 링크로 연결
    if (channel.includes('KBS')) return BROADCAST_LINKS.KBS;
    // 나머지 방송사는 각각의 링크로 연결
    return BROADCAST_LINKS[channel] || '#';
};
