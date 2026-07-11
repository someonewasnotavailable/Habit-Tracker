'use strict';

if (!localStorage.getItem('loggedIn?')) window.location.href = "index.html"
else console.log('signed in');

const STORAGE_KEY = 'habitTrackerState';
const THEME_KEY = 'habitTrackerTheme';

const menuBtn = document.querySelector('.navbarRight img');
const Menu = document.querySelector('.dropMenuleftfck');
const selectHabit = document.querySelectorAll('.alltypesofhabits button');
const addHabit = document.querySelector('.addHabit');
const habitsCont = document.querySelector('.habitsMain');
const toggleBox = document.querySelector('.ldtoggleBox');
const habitTypeMenu = document.querySelector('.alltypesofhabits');
const menuButtons = document.querySelectorAll('.menubtn');
const dashboardMenu = document.querySelector('.dashboardMenu');

const completedCountEl = document.querySelector('.habitsInfoText > p:first-child');
const totalCountEl = document.querySelector('.habitsInfoText > p:last-child');
const currentStreakEl = document.querySelector('.streakinfotext > p:first-child');
const longestStreakEl = document.querySelector('.longestStreakInfotext > p:first-child');
const xpEl = document.querySelector('.XPinfo > p:last-child');
const profileXpEl = document.querySelector('.profileXp');
const profileNameEl = document.querySelector('.profileName');
const profileDetailValues = document.querySelectorAll('.profileDetailBox .detailValue');
const profileProgressValueEl = document.querySelector('.profileProgressValue');
const profileProgressFillEl = document.querySelector('.progressFill');
const profileProgressCaptionEl = document.querySelector('.profileProgressCaption');
const sidebarProgressValueEl = document.querySelector('.profileBar .profileProgressValue');
const sidebarProgressFillEl = document.querySelector('.profileBar .progressFill');
const sidebarProgressCaptionEl = document.querySelector('.profileBar .profileProgressCaption');
const greetings = document.querySelector('.greetings p:first-child')

if (window.location.pathname !== '/profile.html') {
  greetings.textContent = `Good Morning, ${localStorage.getItem('userName')}!👋`
}
else {
  console.log('something');
  
}
profileNameEl.textContent = `${localStorage.getItem('userName')}`


const habitTemplates = {
  Workout: { title: 'Workout', description: '30 minutes exercise', days: '7' },
  'Read a book': { title: 'Read a book', description: 'Read for atleast 20 minutes', days: '5' },
  'Drink Water': { title: 'Drink Water', description: '8 glasses a day', days: '12' },
  Code: { title: 'Code', description: 'Practice Coding', days: '3' },
  Meditate: { title: 'Meditate', description: '10 minutes meditation', days: '1' },
  Journal: { title: 'Journal', description: 'Write your thoughts', days: '4' },
  'Touch Grass': { title: 'Grass', description: 'Touch grass more often', days: '1' }
};

const habitIconMap = {
  Workout: { src: './images/icons8-dumbbell-32 (1).png', className: 'habitIcon--workout' },
  'Read a book': { src: './images/icons8-book-32.png', className: 'habitIcon--book' },
  'Drink Water': { src: './images/drop.png', className: 'habitIcon--water' },
  Code: { src: './images/icons8-rust-programming-language-32.png', className: 'habitIcon--code' },
  Meditate: { src: './images/icons8-meditation-32.png', className: 'habitIcon--meditate' },
  Journal: { src: './images/icons8-journal-32.png', className: 'habitIcon--journal' },
  Grass: { src: './images/icons8-grass-32.png', className: 'habitIcon--grass' }
};

const defaultState = {
  totalHabits: 0,
  completedHabits: 0,
  currentStreak: 0,
  longestStreak: 0,
  xpPoints: 0,
  habits: [],
  lastActiveDate: null
};

let appState = loadState();

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    const toggle = document.querySelector('.ldtoggle');
    if (toggle) toggle.classList.add('light');
  }
}

function saveTheme(isLight) {
  localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...defaultState };

    const parsed = JSON.parse(saved);
    const habits = Array.isArray(parsed.habits) ? parsed.habits : [];

    return {
      totalHabits: Number(parsed.totalHabits) || habits.length,
      completedHabits: Number(parsed.completedHabits) || habits.filter(habit => habit.completed).length,
      currentStreak: Number(parsed.currentStreak) || 0,
      longestStreak: Number(parsed.longestStreak) || 0,
      xpPoints: Number(parsed.xpPoints) || habits.filter(habit => habit.completed).length * 100,
      habits,
      lastActiveDate: parsed.lastActiveDate || null
    };
  } catch (error) {
    console.warn('Could not load saved habits:', error);
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

const formatXP = value => value.toLocaleString('en-US');

const updateProfilePage = () => {
  if (!profileXpEl && !profileNameEl && profileDetailValues.length === 0) return;

  if (profileXpEl) profileXpEl.textContent = `${formatXP(appState.xpPoints)} xp`;
  if (profileNameEl) profileNameEl.textContent = `${localStorage.getItem('userName')}`;

  const values = Array.from(profileDetailValues);
  if (values[0]) values[0].textContent = `${appState.currentStreak} days`;
  if (values[1]) values[1].textContent = `${appState.longestStreak} days`;
  if (values[2]) values[2].textContent = `${appState.completedHabits} / ${appState.totalHabits}`;

  const totalHabits = appState.totalHabits || 0;
  const completedHabits = appState.completedHabits || 0;
  const progressPercent = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  if (profileProgressValueEl) profileProgressValueEl.textContent = `${progressPercent}%`;
  if (profileProgressFillEl) profileProgressFillEl.style.width = `${progressPercent}%`;
  if (profileProgressCaptionEl) profileProgressCaptionEl.textContent = `${completedHabits} of ${totalHabits} habits completed`;

  if (sidebarProgressValueEl) sidebarProgressValueEl.textContent = `${progressPercent}%`;
  if (sidebarProgressFillEl) sidebarProgressFillEl.style.width = `${progressPercent}%`;
  if (sidebarProgressCaptionEl) sidebarProgressCaptionEl.textContent = `${completedHabits} of ${totalHabits} habits completed`;
};

const updateSummary = () => {
  if (completedCountEl) completedCountEl.textContent = appState.completedHabits;
  if (totalCountEl) totalCountEl.textContent = appState.totalHabits;
  if (currentStreakEl) currentStreakEl.textContent = appState.currentStreak;
  if (longestStreakEl) longestStreakEl.textContent = appState.longestStreak;
  if (xpEl) xpEl.textContent = formatXP(appState.xpPoints);
  updateProfilePage();
};

const createHabitElement = habit => {
  const habitElement = document.createElement('div');
  habitElement.className = 'habit';
  habitElement.dataset.id = habit.id;
  const icon = habitIconMap[habit.title] || habitIconMap[habit.title] || { src: './images/icons8-star-32.png', className: 'habitIcon--default' };
  habitElement.innerHTML = `
    <p>⋮⋮</p>
    <div class="habitIcon ${icon.className}">
      <img src="${icon.src}" alt="${habit.title}">
    </div>
    <div class="habitDetail">
      <p>${habit.title}</p>
      <p>${habit.description}</p>
    </div>
    <input class="checkBoxforEachHabit" type="checkbox" ${habit.completed ? 'checked' : ''}>
    <img src="./images/icons8-checkmark-32.png" alt="" class="imgsmth">
    <div class="habitsTimePeriod">
      <p>${habit.days}</p>
      <p>days</p>
    </div>
    <details class="habitMenu">
      <summary class="habitMenuTrigger">⋮</summary>
      <div class="menuPanel">
        <button type="button" class="menuAction editHabitAction">Edit</button>
        <button type="button" class="menuAction deleteHabitAction">Delete</button>
      </div>
    </details>
  `;
  habitsCont.appendChild(habitElement);
};

const renderHabits = () => {
    const existingHabits = habitsCont.querySelectorAll('.habit');
    existingHabits.forEach(habit => habit.remove());

  appState.habits.forEach(createHabitElement);
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const updateDailyStreak = () => {
  const today = getTodayKey();

  if (appState.lastActiveDate === today) return;

  if (!appState.lastActiveDate) {
    appState.currentStreak = 1;
    appState.longestStreak = Math.max(appState.longestStreak, appState.currentStreak);
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);

    if (appState.lastActiveDate === yesterdayKey) {
      appState.currentStreak += 1;
      appState.longestStreak = Math.max(appState.longestStreak, appState.currentStreak);
    } else {
      appState.currentStreak = 1;
    }
  }

  appState.lastActiveDate = today;
};

const toggleHabitCompletion = (habitId, isCompleted) => {
  const habit = appState.habits.find(item => item.id === habitId);
  if (!habit || habit.completed === isCompleted) return;

  habit.completed = isCompleted;

  if (isCompleted) {
    appState.completedHabits += 1;
    appState.xpPoints += 100;
    updateDailyStreak();
  } else {
    appState.completedHabits = Math.max(0, appState.completedHabits - 1);
    appState.xpPoints = Math.max(0, appState.xpPoints - 100);
  }

  appState.totalHabits = appState.habits.length;
  saveState();
  updateSummary();
};

const addNewHabit = (habitName, existingHabitId = null) => {
  const template = habitTemplates[habitName];
  if (!template) return;

  if (existingHabitId) {
    const habit = appState.habits.find(item => item.id === existingHabitId);
    if (!habit) return;

    habit.title = template.title;
    habit.description = template.description;
    habit.days = template.days;
  } else {
    appState.habits.push({
      id: Date.now().toString(),
      title: template.title,
      description: template.description,
      days: template.days,
      completed: false
    });
  }

  appState.totalHabits = appState.habits.length;
  saveState();
  renderHabits();
  updateSummary();
};

const deleteHabit = habitId => {
  const filteredHabits = appState.habits.filter(item => item.id !== habitId);
  appState.habits = filteredHabits;
  appState.totalHabits = appState.habits.length;
  appState.completedHabits = appState.habits.filter(habit => habit.completed).length;
  appState.xpPoints = appState.habits.filter(habit => habit.completed).length * 100;
  appState.currentStreak = 0;
  appState.longestStreak = 0;
  appState.lastActiveDate = null;
  saveState();
  renderHabits();
  updateSummary();
};

const closeMenu = menuElement => {
  if (menuElement?.tagName === 'DETAILS') {
    menuElement.removeAttribute('open');
  }
};

const deleteAllHabits = () => {
  appState.habits = [];
  appState.totalHabits = 0;
  appState.completedHabits = 0;
  appState.currentStreak = 0;
  appState.longestStreak = 0;
  appState.xpPoints = 0;
  appState.lastActiveDate = null;
  saveState();
  renderHabits();
  updateSummary();
};

if (toggleBox) {
  toggleBox.addEventListener('click', e => {
    if (e.target.classList == 'ldtoggle') {
      e.target.classList.toggle('light');
      document.querySelector('body').classList.toggle('light');
      saveTheme(document.body.classList.contains('light'));
    }
    else if (e.target.classList == 'ldtoggleBox') {
      e.target.children[0].classList.toggle('light');
      document.querySelector('body').classList.toggle('light');
      saveTheme(document.body.classList.contains('light'));
    }
  });
}

if (menuBtn && Menu) {
  menuBtn.addEventListener('click', () => {
    Menu.classList.toggle('hidden');
  });
}

if (addHabit) {
  addHabit.addEventListener('click', () => {
    document.querySelector('.alltypesofhabits').classList.toggle('hidden');
    addHabit.classList.toggle('clicked');
  });
}

menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    menuButtons.forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');

    const view = button.dataset.view;
    if (dashboardMenu) {
      dashboardMenu.classList.toggle('habitsView', view === 'habits');
    }
  });
});

if (habitsCont) {
  habitsCont.addEventListener('change', event => {
    if (event.target.classList.contains('checkBoxforEachHabit')) {
      const habitId = event.target.closest('.habit')?.dataset.id;
      toggleHabitCompletion(habitId, event.target.checked);
    }
  });

  habitsCont.addEventListener('click', event => {
    const actionButton = event.target.closest('.menuAction');
    if (!actionButton) return;

    const habitCard = event.target.closest('.habit');
    const habitId = habitCard?.dataset.id;
    const habitMenu = habitCard?.querySelector('.habitMenu');

    if (!habitId) return;

    if (actionButton.classList.contains('editHabitAction') && habitTypeMenu) {
      closeMenu(habitMenu);
      habitTypeMenu.classList.toggle('hidden');
      habitTypeMenu.dataset.editingHabitId = habitId;
    }

    if (actionButton.classList.contains('deleteHabitAction')) {
      closeMenu(habitMenu);
      deleteHabit(habitId);
    }
  });
}

document.querySelector('.inlineMenu .menuAction')?.addEventListener('click', () => {
  const inlineMenu = document.querySelector('.inlineMenu');
  closeMenu(inlineMenu);
  deleteAllHabits();
});

selectHabit.forEach(Each => {
  Each.addEventListener('click', e => {
    selectHabit.forEach(remove => { remove.classList.remove('clicked'); });
    e.target.classList.toggle('clicked');

    if (habitTypeMenu) {
      habitTypeMenu.classList.add('hidden');
      if (habitTypeMenu.dataset.editingHabitId) {
        addNewHabit(e.target.textContent, habitTypeMenu.dataset.editingHabitId);
        delete habitTypeMenu.dataset.editingHabitId;
      } else {
        addNewHabit(e.target.textContent);
      }
    }
  });
});

window.addEventListener('storage', updateProfilePage);
window.addEventListener('pageshow', updateProfilePage);

loadTheme();
renderHabits();
updateSummary();


