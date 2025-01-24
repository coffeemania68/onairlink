const holidayPrograms = {
    "2025-01-27": {
        "KBS": [
            { time: "21:45", title: "달짝지근해", type: "영화" },
            { time: "23:30", title: "룸쉐어링", type: "영화" }
        ],
        "MBC": [
            { time: "10:45", title: "리바운드", type: "영화" },
            { time: "23:40", title: "귀공자", type: "영화" }
        ],
        "SBS": [
            { time: "17:15", title: "콘크리트 유토피아", type: "영화" }
        ],
        "CABLE": [
            { time: "22:10", title: "올빼미", channel: "JTBC", type: "영화" }
        ]
    },
    "2025-01-28": {
        "KBS": [
            { time: "20:45", title: "탈주", type: "영화" },
            { time: "22:15", title: "데시벨", type: "영화" }
        ],
        "SBS": [
            { time: "22:10", title: "서울의 봄", type: "영화" }
        ]
    },
    "2025-01-29": {
        "KBS": [
            { time: "21:00", title: "파묘", type: "영화" },
            { time: "23:20", title: "세자매", type: "영화" }
        ],
        "CABLE": [
            { time: "18:40", title: "정동원 성탄총동원 콘서트", channel: "ENA", type: "공연" },
            { time: "18:50", title: "임영웅 아임 히어로 더 스타디움", channel: "TV조선", type: "공연" }
        ]
    },
    "2025-01-30": {
        "KBS": [
            { time: "12:10", title: "멍뭉이", type: "영화" },
            { time: "21:50", title: "시민덕희", type: "영화" }
        ],
        "MBC": [
            { time: "23:40", title: "싱글 인 서울", type: "영화" }
        ],
        "SBS": [
            { time: "12:20", title: "스위치", type: "영화" },
            { time: "22:10", title: "성시경 자 오늘은", type: "공연" }
        ],
        "CABLE": [
            { time: "19:50", title: "빅토리", channel: "JTBC", type: "영화" },
            { time: "20:10", title: "드림", channel: "JTBC", type: "영화" },
            { time: "21:10", title: "비공식작전", channel: "TV조선", type: "영화" }
        ]
    }
};

// 방송사별 온에어 링크
const BROADCAST_LINKS = {
    KBS: "https://naver.me/FWJUsmCX",
    MBC: "https://naver.me/xXrv590N",
    SBS: "https://naver.me/FJHYQIPf",
    JTBC: "https://naver.me/IFKhECD1",
    TV_CHOSUN: "https://naver.me/5FhmQnMU",
    MBN: "https://naver.me/GrA3Ec3W"
};

document.addEventListener('DOMContentLoaded', () => {
    initializeDateTabs();
    setupMobileMenu();
    setupLazyLoading();
});

// 날짜 탭 초기화
function initializeDateTabs() {
    const tabs = document.querySelectorAll('.date-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 활성 탭 변경
            document.querySelector('.date-tab.active')?.classList.remove('active');
            tab.classList.add('active');
            // 프로그램 표시 업데이트
            displayPrograms(tab.dataset.date);
        });
    });

    // 현재 시간에 맞는 탭 자동 선택
    selectAppropriateTab();
}

// 현재 시간에 맞는 탭 선택
function selectAppropriateTab() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    let appropriateDate = Object.keys(holidayPrograms)
        .find(date => date >= dateStr) || Object.keys(holidayPrograms)[0];

    const tab = document.querySelector(`[data-date="${appropriateDate}"]`);
    if (tab) {
        tab.click();
    }
}

// 프로그램 표시 함수
function displayPrograms(date) {
    const now = new Date();
    const programData = holidayPrograms[date];

    Object.keys(programData).forEach(channel => {
        const container = document.getElementById(`${channel.toLowerCase()}-programs`);
        if (!container) return;

        container.innerHTML = ''; // 기존 내용 비우기
        
        programData[channel]
            .filter(program => {
                // 지난 방송 필터링
                const programTime = new Date(`${date} ${program.time}`);
                return programTime > now;
            })
            .forEach(program => {
                const programElement = createProgramElement(program);
                container.appendChild(programElement);
            });
    });
}

// 프로그램 요소 생성
function createProgramElement(program) {
    const div = document.createElement('div');
    div.className = 'program-item mb-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all';
    
    div.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-gray-600">${program.time}</span>
            <span class="text-sm px-2 py-1 bg-gray-200 rounded">${program.type}</span>
        </div>
        <h3 class="text-lg font-bold mt-1">${program.title}</h3>
        ${program.channel ? `<span class="text-sm text-gray-500">${program.channel}</span>` : ''}
    `;

    return div;
}

// 모바일 메뉴 설정
function setupMobileMenu() {
    if (window.innerWidth < 768) {
        const dateContainer = document.querySelector('.date-tabs');
        dateContainer.classList.add('scrollable-tabs');
    }
}

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
