네, broadcast.js 파일을 js 폴더에 생성하고 아래 코드를 넣으면 됩니다:

Copy// 지상파 방송 프로그램 데이터
const broadcastPrograms = {
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
    const dayPrograms = broadcastPrograms[date];

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
        'KBS': 'bg-red-100 text-red-800',
        'MBC': 'bg-blue-100 text-blue-800',
        'SBS': 'bg-orange-100 text-orange-800'
    };
    return colors[channel] || 'bg-gray-100 text-gray-800';
}

// 날짜 포맷팅
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
}
