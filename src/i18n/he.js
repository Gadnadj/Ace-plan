/**
 * כל מחרוזות הממשק בעברית
 */
export const he = {
  appName: 'מלאי ריהוט',
  loading: 'טוען...',

  // כותרת
  gestion: 'ניהול',
  admin: 'מנהל',
  quit: 'יציאה',
  adminAccess: 'גישת ניהול',

  // מחלקות
  switchDepartment: 'בחירת מחלקה',
  switchDepartmentSubtitle: 'בחרו לאיזה מלאי לעבור',
  departmentsList: 'מחלקות / דפים',
  addDepartment: 'הוספת מחלקה חדשה',
  newDepartmentPlaceholder: 'למשל: מלאי גנים',
  departmentExists: 'המחלקה כבר קיימת',
  departmentEmpty: 'יש להזין שם',
  departmentSaveError: 'שגיאה בשמירת המחלקה',

  // הגדרות
  settings: 'הגדרות',
  settingsTitle: 'הגדרות',
  settingsSubtitle: 'ניהול מחלקות ואותיות אזור',
  zonesList: 'אותיות אזור',
  addZone: 'הוספת אזור חדש',
  newZonePlaceholder: 'D',
  noZones: 'אין אזורים מוגדרים',
  zoneExists: 'האות כבר קיימת',
  zoneEmpty: 'יש להזין אות',
  zoneSaveError: 'שגיאה בשמירת האזור',

  // מיקום
  locationNumber: 'מספר מיקום',
  numberPlaceholder: '12',
  locationPreview: 'מיקום',

  // חיפוש
  searchPlaceholder: 'חיפוש לפי קוד או מיקום (101, A-06)',
  searchLabel: 'חיפוש חבילה לפי קוד או מיקום',
  clearSearch: 'ניקוי החיפוש',

  // רשימה
  addPackage: 'הוספת חבילה',
  edit: 'עריכה',
  delete: 'מחיקה',
  updatedAt: 'עודכן ב-',
  category: 'קטגוריה',
  notUpdated: 'טרם עודכן',
  noPackages: 'אין חבילות רשומות',
  noPackagesFor: (code) => `לא נמצאה חבילה עבור «${code}»`,
  packagesShown: (count) =>
    count === 1 ? 'חבילה אחת מוצגת' : `${count} חבילות מוצגות`,

  // PIN
  pinTitle: 'גישת ניהול',
  pinSubtitle: 'הזינו קוד PIN לוגיסטי',
  pinLabel: 'קוד PIN',
  pinWrong: 'קוד PIN שגוי',
  cancel: 'ביטול',
  confirm: 'אישור',
  save: 'שמירה',
  add: 'הוספה',

  // הוספת חבילה
  addTitle: 'הוספת חבילה',
  addSubtitle: 'הזינו קוד מוצר ומיקום',
  productCode: 'קוד מוצר (3 ספרות)',
  location: 'מיקום',
  close: 'סגירה',
  codePlaceholder: 'למשל: 501',
  addAnyway: 'להוסיף בכל זאת',
  duplicateCodeWarning: (code, departements) =>
    `הקוד ${code} כבר קיים במחלקה: ${departements.join(', ')}. להוסיף בכל זאת?`,

  // עריכה
  editTitle: 'עריכת מיקום',
  package: 'חבילה',
  newLocation: 'מיקום חדש',
  locationEmpty: 'המיקום לא יכול להיות ריק',

  // מחיקה
  deleteTitle: 'למחוק חבילה זו?',
  deleteMessage: (code, location) =>
    `החבילה ${code} (${location}) תימחק לצמיתות.`,
  confirmDeleteZone: (zone) => `למחוק את האזור ${zone}?`,
  confirmDeleteDepartment: (department) => `למחוק את המחלקה ${department}?`,

  // שגיאות
  codeMustBe3Digits: 'הקוד חייב להכיל בדיוק 3 ספרות',
  locationCannotBeEmpty: 'המיקום לא יכול להיות ריק',
}
