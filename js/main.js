const holidayPrograms = {
    "2025-01-27": {
        "KBS": [
            { time: "21:45", title: "달짝지근해", type: "영화" },
            { time: "23:30", title: "룸쉐어링", type: "영화" }
        ],
        // ... (기존 데이터 유지)
    },
    // ... (다른 날짜 데이터 유지)
};

const BROADCAST_LINKS = {
    KBS: "https://naver.me/FWJUsmCX",
    MBC: "https://naver.me/xXrv590N",
    SBS: "https://naver.me/FJHYQIPf",
    JTBC: "https://naver.me/IFKhECD1",
    TV_CHOSUN: "https://naver.me/5FhmQnMU",
    MBN: "https://naver.me/GrA3Ec3W"
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeDateTabs();
    setupMobileMenu();
    setupLazyLoading();
    adjustLayout();
});

// 날짜 탭 초기화
function initializeDateTabs() {
    const tabs = document.querySelectorAll('.date-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.date-tab.active')?.classList.remove('active');
            tab.classList.add('active');
            displayPrograms(tab.dataset.date);
        });
    });
    selectAppropriateTab();
}

// 새로운 프로그램 표시 함수
function displayPrograms(date) {
    const dailyContainer = document.getElementById('daily-programs');
    const now = new Date();
    const programData = holidayPrograms[date];

    // 전체 프로그램 목록 초기화
    dailyContainer.innerHTML = `
        <h3 class="text-xl font-bold mb-4">${formatDate(date)} 프로그램 목록</h3>
        <div class="program-list space-y-4"></div>
    `;
    const programList = dailyContainer.querySelector('.program-list');

    // 모든 채널의 프로그램을 시간순으로 정렬
    const allPrograms = [];
    Object.keys(programData || {}).forEach(channel => {
        programData[channel].forEach(program => {
            allPrograms.push({
                ...program,
                channel: program.channel || channel
            });
        });
    });

    // 시간순 정렬
    allPrograms.sort((a, b) => a.time.localeCompare(b.time));

    // 프로그램 표시
    if (allPrograms.length === 0) {
        programList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                이 날의 특선 프로그램이 없습니다
            </div>
        `;
    } else {
        allPrograms.forEach(program => {
            const programElement = createProgramElement(program);
            programList.appendChild(programElement);
        });
    }

    // 방송사별 프로그램도 업데이트
    updateChannelPrograms(date, programData);
}

// 방송사별 프로그램 업데이트
function updateChannelPrograms(date, programData) {
    Object.keys(programData || {}).forEach(channel => {
        const container = document.getElementById(`${channel.toLowerCase()}-programs`);
        if (!container) return;

        container.innerHTML = '';
        const programs = programData[channel];
        
        if (programs.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4 text-gray-500">
                    프로그램이 없습니다
                </div>
            `;
        } else {
            programs.forEach(program => {
                container.appendChild(createProgramElement({
                    ...program,
                    channel: program.channel || channel
                }));
            });
        }
    });
}

// 프로그램 요소 생성
function createProgramElement(program) {
    const div = document.createElement('div');
    div.className = 'program-item bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all';
    
    div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <span class="text-lg font-bold">${program.time}</span>
            <div class="flex gap-2 items-center">
                <span class="px-3 py-1 rounded-full text-sm ${getChannelColorClass(program.channel)}">${program.channel}</span>
                <span class="px-3 py-1 rounded-full text-sm bg-gray-100">${program.type}</span>
            </div>
        </div>
        <h4 class="text-xl font-bold">${program.title}</h4>
    `;

    return div;
}

// 채널별 색상 클래스
function getChannelColorClass(channel) {
    const colors = {
        'KBS': 'bg-red-100 text-red-800',
        'MBC': 'bg-blue-100 text-blue-800',
        'SBS': 'bg-orange-100 text-orange-800',
        'JTBC': 'bg-purple-100 text-purple-800',
        'TV조선': 'bg-purple-100 text-purple-800',
        'MBN': 'bg-purple-100 text-purple-800',
        'ENA': 'bg-purple-100 text-purple-800'
    };
    return colors[channel] || 'bg-gray-100 text-gray-800';
}

// 날짜 포맷팅
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
}

// 기존 함수들 유지
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

function setupMobileMenu() {
    if (window.innerWidth < 768) {
        const dateContainer = document.querySelector('.date-tabs');
        dateContainer.classList.add('scrollable-tabs');
    }
}

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

// 광고 관련 이벤트 리스너
window.addEventListener('load', () => {
    setTimeout(adjustLayout, 1000);
});

window.addEventListener('resize', adjustLayout);
setInterval(adjustLayout, 2000);
