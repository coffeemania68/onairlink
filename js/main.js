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
    adjustLayout(); // 광고 레이아웃 초기 조정
});

// 날짜 탭 초기화 (기존 함수 수정)
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

// 프로그램 표시 함수 (수정)
function displayPrograms(date) {
    const now = new Date();
    const programData = holidayPrograms[date];

    Object.keys(programData || {}).forEach(channel => {
        const container = document.getElementById(`${channel.toLowerCase()}-programs`);
        if (!container) return;

        container.innerHTML = ''; // 기존 내용 비우기
        
        const programs = programData[channel]
            .filter(program => {
                // 지난 방송 필터링
                const programTime = new Date(`${date} ${program.time}`);
                return programTime > now;
            });

        if (programs.length === 0) {
            // 프로그램이 없는 경우 메시지 표시
            container.innerHTML = `
                <div class="text-center py-4 text-gray-500">
                    이 날의 특선 프로그램이 없습니다
                </div>
            `;
        } else {
            // 프로그램 목록 표시
            programs.forEach(program => {
                container.appendChild(createProgramElement(program));
            });
        }
    });
}

/// 프로그램 요소 생성 (수정: hover 효과 추가)
function createProgramElement(program) {
    const div = document.createElement('div');
    div.className = 'program-item mb-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer';
    
    div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600 text-lg">${program.time}</span>
            <span class="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium">${program.type}</span>
        </div>
        <h3 class="text-xl font-bold mb-1">${program.title}</h3>
        ${program.channel ? `<span class="text-sm text-gray-500">${program.channel}</span>` : ''}
    `;

    return div;
}

// 광고 레이아웃 조정 함수 (새로 추가)
function adjustLayout() {
    const adContainer = document.getElementById('ad-container');
    const header = document.getElementById('main-header');
    const mainContent = document.getElementById('main-content');
    
    if (adContainer && adContainer.offsetHeight > 0) {
        header.style.top = adContainer.offsetHeight + 'px';
        mainContent.style.marginTop = (adContainer.offsetHeight + 64) + 'px';
    } else {
        header.style.top = '0px';
        mainContent.style.marginTop = '64px';
    }
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

// 광고 관련 이벤트 리스너 추가
window.addEventListener('load', () => {
    setTimeout(adjustLayout, 1000); // 광고 로드 시간 고려
});

window.addEventListener('resize', adjustLayout);

// 주기적으로 광고 높이 체크
setInterval(adjustLayout, 2000);
이렇게 각 함수와 이벤트 리스너가 올바르게 구분되도록 수정했습니다. 이대로 진행할까요?

This answer isn't good enough?
Try Mixture-of-Agents
