// 프로그램 데이터
const livePrograms = {
    "2025-01-27": {
        "KBS": [
            { time: "21:45", title: "달짝지근해", type: "영화", theme: "red" },
            { time: "23:30", title: "룸쉐어링", type: "영화", theme: "red" }
        ],
        "MBC": [
            { time: "10:45", title: "리바운드", type: "영화", theme: "blue" },
            { time: "23:40", title: "귀공자", type: "영화", theme: "blue" }
        ],
        "SBS": [
            { time: "17:15", title: "콘크리트 유토피아", type: "영화", theme: "orange" }
        ],
        "CABLE": [
            { time: "22:10", title: "올빼미", channel: "JTBC", type: "영화", theme: "purple" }
        ]
    },
    // ... (다른 날짜 데이터)
};

// 방송사 테마 설정
const channelThemes = {
    KBS: { 
        gradient: 'from-red-500 to-red-700',
        border: 'border-red-500',
        text: 'text-red-500',
        highlight: 'bg-red-500'
    },
    MBC: {
        gradient: 'from-blue-500 to-blue-700',
        border: 'border-blue-500',
        text: 'text-blue-500',
        highlight: 'bg-blue-500'
    },
    SBS: {
        gradient: 'from-orange-500 to-orange-700',
        border: 'border-orange-500',
        text: 'text-orange-500',
        highlight: 'bg-orange-500'
    },
    CABLE: {
        gradient: 'from-purple-500 to-purple-700',
        border: 'border-purple-500',
        text: 'text-purple-500',
        highlight: 'bg-purple-500'
    }
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeDateSlider();
    loadPrograms('2025-01-27', 'all');
    
    // 스크롤 애니메이션 초기화
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });
});

// 탭 초기화
function initializeTabs() {
    const tabs = document.querySelectorAll('.broadcast-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 활성 탭 변경
            document.querySelector('.broadcast-tab.active')?.classList.remove('active');
            tab.classList.add('active');
            
            // 프로그램 필터링
            const channel = tab.dataset.channel;
            const currentDate = document.querySelector('.date-button.active')?.dataset.date;
            loadPrograms(currentDate, channel);
        });
    });
}

// 날짜 슬라이더 초기화
function initializeDateSlider() {
    const dateButtons = document.querySelectorAll('.date-button');
    dateButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.date-button.active')?.classList.remove('active');
            button.classList.add('active');
            
            const channel = document.querySelector('.broadcast-tab.active')?.dataset.channel;
            loadPrograms(button.dataset.date, channel);
        });
    });
}

// 프로그램 로드 및 표시
function loadPrograms(date, channel) {
    const grid = document.getElementById('program-grid');
    grid.innerHTML = ''; // 기존 내용 초기화

    const programs = livePrograms[date];
    if (!programs) return;

    let filteredPrograms = [];
    Object.entries(programs).forEach(([ch, progs]) => {
        if (channel === 'all' || ch.toLowerCase() === channel) {
            progs.forEach(prog => {
                filteredPrograms.push({...prog, channel: prog.channel || ch});
            });
        }
    });

    // 시간순 정렬
    filteredPrograms.sort((a, b) => a.time.localeCompare(b.time));

    // 프로그램 카드 생성
    filteredPrograms.forEach((program, index) => {
        const card = createProgramCard(program, index);
        grid.appendChild(card);
    });
}

// 프로그램 카드 생성
function createProgramCard(program, index) {
    const delay = index * 100; // 순차적 애니메이션을 위한 딜레이
    const theme = channelThemes[program.channel.split(' ')[0]] || channelThemes.CABLE;
    
    const div = document.createElement('div');
    div.className = `program-card bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg transition-all hover:transform hover:scale-105`;
    div.setAttribute('data-aos', 'fade-up');
    div.setAttribute('data-aos-delay', delay);
    
    div.innerHTML = `
        <div class="bg-gradient-to-br ${theme.gradient} p-4">
            <div class="flex justify-between items-center mb-2">
                <span class="text-lg font-bold">${program.time}</span>
                <span class="px-3 py-1 rounded-full text-sm bg-white/20">${program.type}</span>
            </div>
            <h3 class="text-xl font-bold mb-1">${program.title}</h3>
            <span class="text-sm text-white/80">${program.channel}</span>
        </div>
        <div class="p-4 bg-black/20">
            <button class="watch-button w-full py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                실시간 시청하기
            </button>
        </div>
    `;

    // 호버 효과
    div.addEventListener('mouseenter', () => {
        div.style.transform = 'translateY(-5px)';
        div.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)';
    });

    div.addEventListener('mouseleave', () => {
        div.style.transform = 'translateY(0)';
        div.style.boxShadow = '';
    });

    return div;
}

// 날짜 포맷팅
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
}

// 스크롤 이벤트 처리
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('backdrop-blur-lg');
    } else {
        header.classList.remove('backdrop-blur-lg');
    }
});

// 반응형 그리드 조정
function adjustGrid() {
    const grid = document.getElementById('program-grid');
    if (window.innerWidth < 768) {
        grid.classList.remove('md:grid-cols-2', 'lg:grid-cols-3');
    } else {
        grid.classList.add('md:grid-cols-2', 'lg:grid-cols-3');
    }
}

window.addEventListener('resize', adjustGrid);
adjustGrid(); // 초기 실행
