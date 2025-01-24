// 종편 방송 프로그램 데이터
const cablePrograms = {
    "2025-01-27": {
        "JTBC": [
            { time: "22:10", title: "올빼미", type: "영화" }
        ]
    },
    "2025-01-29": {
        "ENA": [
            { time: "18:40", title: "정동원 성탄총동원 콘서트", type: "공연" }
        ],
        "TV조선": [
            { time: "18:50", title: "임영웅 아임 히어로 더 스타디움", type: "공연" }
        ]
    },
    "2025-01-30": {
        "JTBC": [
            { time: "19:50", title: "빅토리", type: "영화" },
            { time: "20:10", title: "드림", type: "영화" }
        ],
        "TV조선": [
            { time: "21:10", title: "비공식작전", type: "영화" }
        ]
    }
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeDateTabs();
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

    // 첫 날짜의 프로그램 표시
    displayPrograms('2025-01-27');
}

// 프로그램 표시
function displayPrograms(date) {
    const programList = document.getElementById('program-list');
    const dayPrograms = cablePrograms[date];

    // 프로그램 목록 초기화
    programList.innerHTML = `<h3 class="text-xl font-bold mb-4">${formatDate(date)}</h3>`;

    if (!dayPrograms) {
        programList.innerHTML += `
            <div class="text-center py-8 text-gray-500">
                이 날의 방송 프로그램이 없습니다
            </div>
        `;
        return;
    }

    // 모든 프로그램을 시간순으로 정렬
    const allPrograms = [];
    Object.entries(dayPrograms).forEach(([channel, programs]) => {
        programs.forEach(program => {
            allPrograms.push({
                ...program,
                channel
            });
        });
    });

    // 시간순 정렬
    allPrograms.sort((a, b) => a.time.localeCompare(b.time));

    // 프로그램 표시
    allPrograms.forEach(program => {
        const programElement = createProgramElement(program);
        programList.appendChild(programElement);
    });
}

// 프로그램 요소 생성
function createProgramElement(program) {
    const div = document.createElement('div');
    div.className = 'program-item bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all';
    
    div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <span class="text-lg font-bold">${program.time}</span>
            <div class="flex gap-2">
                <span class="px-3 py-1 rounded-full text-sm ${getChannelColorClass(program.channel)}">${program.channel}</span>
                <span class="px-3 py-1 rounded-full text-sm bg-gray-200">${program.type}</span>
            </div>
        </div>
        <h4 class="text-xl font-bold">${program.title}</h4>
    `;

    return div;
}

// 채널별 색상 클래스
function getChannelColorClass(channel) {
    const colors = {
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
