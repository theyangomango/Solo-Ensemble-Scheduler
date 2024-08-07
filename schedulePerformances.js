const { faker } = require('@faker-js/faker');

// Function to convert minutes to a readable time format (e.g., "2:04pm")
const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `${formattedHours}:${formattedMins}${period.toLowerCase()}`;
};

const generateFakePerformances = (numPerformances) => {
    const events = ['solo', 'ensemble'];
    const timePreferences = ['AM', 'PM'];
    const lengths = [4, 8];

    const performances = [];
    const accompanists = new Set();

    for (let i = 0; i < numPerformances; i++) {
        const event = events[Math.floor(Math.random() * events.length)];
        const accompanistFirstName = faker.person.firstName();
        const accompanistLastName = faker.person.lastName();
        const accompanistFullName = `${accompanistFirstName} ${accompanistLastName}`;

        accompanists.add(accompanistFullName);

        if (event === 'solo') {
            performances.push({
                event: 'solo',
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                accompanist: accompanistFullName,
                timePreference: timePreferences[Math.floor(Math.random() * timePreferences.length)],
                length: lengths[Math.floor(Math.random() * lengths.length)],
            });
        } else {
            const ensembleSize = Math.floor(Math.random() * 3) + 2; // 2 to 4 students
            const ensembleMembers = [];
            for (let j = 0; j < ensembleSize; j++) {
                ensembleMembers.push({
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName()
                });
            }
            performances.push({
                event: 'ensemble',
                members: ensembleMembers,
                accompanist: accompanistFullName,
                timePreference: timePreferences[Math.floor(Math.random() * timePreferences.length)],
                length: lengths[Math.floor(Math.random() * lengths.length)],
            });
        }
    }

    return performances;
};

const schedulePerformances = (performances, rooms) => {
    const AM_START = 8 * 60; // 8:00 AM in minutes
    const AM_END = 12 * 60; // 12:00 PM in minutes
    const PM_START = 13 * 60; // 1:00 PM in minutes
    const PM_END = 18 * 60; // 6:00 PM in minutes

    const amPerformances = performances.filter(performance => performance.timePreference === 'AM').sort((a, b) => a.length - b.length);
    const pmPerformances = performances.filter(performance => performance.timePreference === 'PM').sort((a, b) => a.length - b.length);

    const accompanistRoomMap = new Map();
    rooms.forEach((room, index) => accompanistRoomMap.set(index, room));

    const schedule = [];
    const roomPerformanceMap = new Map();
    let preferenceNotMetCount = 0; // Counter to track preferences not met
    let successfullyScheduledCount = 0; // Counter to track successfully scheduled performances

    rooms.forEach(room => {
        roomPerformanceMap.set(room, {
            room: room,
            accompanist: '',
            performances: []
        });
    });

    const assignPerformancesToRooms = (performances, period, originalPreference) => {
        performances.forEach(performance => {
            let preferenceMet = false;

            for (let [index, room] of accompanistRoomMap.entries()) {
                const roomInfo = roomPerformanceMap.get(room);

                if (roomInfo.performances.length === 0 || roomInfo.performances[roomInfo.performances.length - 1].timestamp + performance.length <= (period === 'AM' ? AM_END : PM_END)) {
                    const performanceDetail = {
                        ...performance,
                        room: room, // Add room number to the performance detail
                        timestamp: roomInfo.performances.length === 0 ? (period === 'AM' ? AM_START : PM_START) : roomInfo.performances[roomInfo.performances.length - 1].timestamp + performance.length,
                        time: minutesToTime(roomInfo.performances.length === 0 ? (period === 'AM' ? AM_START : PM_START) : roomInfo.performances[roomInfo.performances.length - 1].timestamp + performance.length)
                    };

                    roomInfo.performances.push(performanceDetail);
                    roomInfo.accompanist = performance.accompanist;

                    schedule.push(performanceDetail);
                    preferenceMet = true;

                    // Increment the counter for successfully scheduled performances
                    successfullyScheduledCount++;

                    // Increment preferenceNotMetCount if the scheduled period is not the preferred one
                    if (period !== originalPreference) {
                        preferenceNotMetCount++;
                    }

                    break;
                }
            }

            if (!preferenceMet && period === 'AM') {
                // If the preference was not met in the AM, try scheduling in the PM
                assignPerformancesToRooms([performance], 'PM', originalPreference);
            } else if (!preferenceMet && period === 'PM') {
                preferenceNotMetCount++; // Increment count if preference not met in both AM and PM
            }
        });
    };

    assignPerformancesToRooms(amPerformances, 'AM', 'AM');
    assignPerformancesToRooms(pmPerformances, 'PM', 'PM');

    return { roomPerformanceMap, preferenceNotMetCount, successfullyScheduledCount, schedule };
};

// Generate fake performances and rooms
const performances = generateFakePerformances(1000);
const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6', 'Room 7', 'Room 8', 'Room 9', 'Room 10'];

const { roomPerformanceMap, preferenceNotMetCount, successfullyScheduledCount, schedule } = schedulePerformances(performances, rooms);

// Output the preference not met count
console.log('Number of times preferences were not met:', preferenceNotMetCount);

// Output the total number of successfully scheduled performances
console.log('Total number of performances successfully scheduled:', successfullyScheduledCount);

// Output the schedule by room
const roomPerformanceArray = Array.from(roomPerformanceMap.values());
console.log(roomPerformanceArray);

// Output the list of performances with individual information and schedules
console.log('List of all scheduled performances:');
schedule.slice(0, 10).forEach(performance => {
    console.log(performance);
});
