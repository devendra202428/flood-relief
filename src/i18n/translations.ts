export type Language = 'en' | 'hi';

export interface Translations {
  // Navigation & Topbar
  appTitle: string;
  dashboard: string;
  register: string;
  distribute: string;
  search: string;
  records: string;
  quickDispatch: string;
  cloudSyncing: string;
  cloudLive: string;

  // Dashboard
  registeredHouseholds: string;
  priorityVulnerable: string;
  householdsReached: string;
  coverageAchieved: string;
  noHouseholdsAdded: string;
  pendingHouseholds: string;
  awaitingAllocation: string;
  kitsDispatched: string;
  acrossAllRounds: string;
  bannerTitle: string;
  bannerDesc: string;
  registerHouseholdBtn: string;
  recordDispatchBtn: string;
  exportCsvBtn: string;
  recentDistributionsTitle: string;
  recentDistributionsSubtitle: string;
  viewFullLedger: string;
  noDistributionsYet: string;
  householdCol: string;
  kitTypeCol: string;
  villageCol: string;
  qtyCol: string;
  actionsCol: string;
  printSlip: string;
  areaCoverageProgress: string;
  campStockStatus: string;
  manage: string;
  issued: string;
  left: string;
  duplicateProtocolTitle: string;
  duplicateProtocolDesc: string;

  // Registration
  registerTitle: string;
  registerSubtitle: string;
  assignedId: string;
  familyHeadName: string;
  familyHeadPlaceholder: string;
  mobileNumber: string;
  mobilePlaceholder: string;
  mobileHelp: string;
  alreadyRegisteredUnder: string;
  villageWard: string;
  villagePlaceholder: string;
  assignedCamp: string;
  familySize: string;
  persons: string;
  extendedFamilyEligible: string;
  specialNeedsNotes: string;
  specialNotesPlaceholder: string;
  vulnerabilityFlagsTitle: string;
  flagInfant: string;
  flagPregnant: string;
  flagElderly: string;
  flagDisabled: string;
  flagSingleParent: string;
  autoIdNotice: string;
  clearForm: string;
  submitRegister: string;
  regSuccessTitle: string;
  proceedToDistribute: string;
  printQueueToken: string;

  // Photo & Duplicate Detection
  photoSectionTitle: string;
  photoSectionSubtitle: string;
  modeCamera: string;
  modeUpload: string;
  modeSamples: string;
  alignDwellingGuide: string;
  autoHashNotice: string;
  snapAndVerify: string;
  analyzing: string;
  launchCamera: string;
  cameraAccessError: string;
  browsePhotoClick: string;
  browsePhotoSupport: string;
  selectPhotoFile: string;
  trySamplePhotos: string;
  trySamplePhotoLink: string;
  capturedDwellingPhoto: string;
  retakeReplace: string;
  damageLevelLabel: string;
  damageSubmerged: string;
  damageSevere: string;
  damagePartial: string;
  damageInundated: string;
  biometricVerificationTitle: string;
  biometricVerificationDesc: string;
  duplicateRiskAlert: string;
  duplicateRiskDesc: string;
  newCapturedPhoto: string;
  matchedExistingRecord: string;
  matchScore: string;
  supervisorOverrideCheck: string;
  uniqueDwellingVerified: string;

  // Distribution
  distributeTitle: string;
  distributeSubtitle: string;
  liveFieldCounter: string;
  locateHousehold: string;
  searchPlaceholder: string;
  changeFamily: string;
  familyMembersCount: string;
  rationKitType: string;
  reliefRound: string;
  roundHelp: string;
  handoverDate: string;
  numberOfKits: string;
  standardQuotaHelp: string;
  dispatchedByOfficer: string;
  officerPlaceholder: string;
  duplicateDistAlertTitle: string;
  duplicateDistAlertDesc: string;
  duplicateOverrideCheck: string;
  overrideReasonLabel: string;
  overrideReasonPlaceholder: string;
  recordDistributionBtn: string;
  distSuccessTitle: string;
  printHandoverReceipt: string;
  recordNextHousehold: string;

  // Search
  searchHeaderTitle: string;
  searchHeaderSubtitle: string;
  searchBarPlaceholder: string;
  filterAll: string;
  filterPending: string;
  filterDistributed: string;
  filterVulnerable: string;
  dwellingCol: string;
  statusCol: string;
  statusGiven: string;
  statusPending: string;
  noMatchingFound: string;
  resetFilters: string;
  showingHouseholdsCount: string;

  // Records & Inventory
  recordsTitle: string;
  recordsSubtitle: string;
  exportFamiliesCsv: string;
  exportDistributionsCsv: string;
  tabHouseholds: string;
  tabLedger: string;
  tabInventory: string;
  dispatched: string;
  remainingBuffer: string;
  totalStock: string;
  save: string;
  resetDemoDataTitle: string;
  resetDemoDataDesc: string;
  resetDemoDataBtn: string;

  // Slip / Voucher
  slipHeaderOrg: string;
  slipHeaderTitle: string;
  slipId: string;
  dateLabel: string;
  verifiedDwellingBadge: string;
  verifiedHandoverRecord: string;
  kitAllocated: string;
  dispatchedBy: string;
  queueTokenNoticeTitle: string;
  queueTokenNoticeDesc: string;
  recipientSignature: string;
  officerSeal: string;
  printReceiptBtn: string;
  closeBtn: string;

  // Footer & Global
  footerHub: string;
  footerLocalNotice: string;
  langEnglish: string;
  langHindi: string;
  chooseLanguage: string;
  householdDetailsTitle: string;
  quickDistributeBtn: string;
  damageAssessed: string;
  totalKitsReceived: string;
  distributionHistory: string;
  noDistributionHistory: string;
  registeredOn: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'FloodRelief',
    dashboard: 'Dashboard',
    register: 'Register',
    distribute: 'Distribute',
    search: 'Search',
    records: 'Records',
    quickDispatch: 'Quick Dispatch',
    cloudSyncing: 'Cloud Syncing...',
    cloudLive: 'Cloud 50k+ Live',
    langEnglish: 'English',
    langHindi: 'हिन्दी',
    chooseLanguage: 'Select Language',
    householdDetailsTitle: 'Household Relief Profile',
    quickDistributeBtn: 'Issue Ration Kit',
    damageAssessed: 'Damage Assessed',
    totalKitsReceived: 'Total Kits Received',
    distributionHistory: 'Distribution History',
    noDistributionHistory: 'No distributions logged yet for this household.',
    registeredOn: 'Registered',

    registeredHouseholds: 'Registered Households',
    priorityVulnerable: 'priority vulnerable',
    householdsReached: 'Households Reached',
    coverageAchieved: 'coverage achieved',
    noHouseholdsAdded: 'No households added',
    pendingHouseholds: 'Pending Households',
    awaitingAllocation: 'Awaiting allocation',
    kitsDispatched: 'Ration Kits Dispatched',
    acrossAllRounds: 'Across all relief rounds',
    bannerTitle: 'Active Field Relief Operations — Monitored Locally',
    bannerDesc: 'Offline-resilient camp registry with duplicate phone and round allocation checks. Export CSV backups regularly before shifts end.',
    registerHouseholdBtn: '+ Register Household',
    recordDispatchBtn: 'Record Ration Dispatch',
    exportCsvBtn: 'Export CSV',
    recentDistributionsTitle: 'Recent Ration Distributions',
    recentDistributionsSubtitle: 'Live feed of verified household aid handovers',
    viewFullLedger: 'View Full Ledger',
    noDistributionsYet: 'No distributions recorded yet. Begin by registering families and dispatching relief kits.',
    householdCol: 'Household',
    kitTypeCol: 'Kit Type',
    villageCol: 'Village',
    qtyCol: 'Qty',
    actionsCol: 'Actions',
    printSlip: 'Print Slip',
    areaCoverageProgress: 'Area Coverage Progress',
    campStockStatus: 'Camp Stock Status',
    manage: 'Manage',
    issued: 'Issued',
    left: 'left',
    duplicateProtocolTitle: 'Duplicate Prevention Protocol:',
    duplicateProtocolDesc: 'The system checks for same-round duplicate distributions. Always verify recipient credentials or photo ID card before approving supervisor overrides.',

    registerTitle: 'Register Affected Household',
    registerSubtitle: 'Enroll flood-affected families for relief entitlement, quota allocation, and safety tracking.',
    assignedId: 'Assigned ID',
    familyHeadName: 'Family Head Name',
    familyHeadPlaceholder: 'e.g. Ramesh Kumar Prasad',
    mobileNumber: 'Primary Mobile Number',
    mobilePlaceholder: '10-digit mobile number',
    mobileHelp: 'Used for duplicate verification and emergency alerts.',
    alreadyRegisteredUnder: 'Already registered under',
    villageWard: 'Village / Submerged Ward / Colony',
    villagePlaceholder: 'e.g. Rampur Ward 3, Lowland Block',
    assignedCamp: 'Assigned Relief Camp / Shelter Station',
    familySize: 'Total Family Members',
    persons: 'Persons',
    extendedFamilyEligible: '(Extended Family - Double Kit eligible)',
    specialNeedsNotes: 'Medical / Critical Needs Notes (Optional)',
    specialNotesPlaceholder: 'e.g. Insulin dependent, requires wheelchair',
    vulnerabilityFlagsTitle: 'Vulnerability Flags (For Priority Kit Routing)',
    flagInfant: 'Infant / Child (< 2 yrs)',
    flagPregnant: 'Pregnant / Lactating',
    flagElderly: 'Elderly (65+ yrs)',
    flagDisabled: 'Person with Disability',
    flagSingleParent: 'Single Parent Household',
    autoIdNotice: 'Household will be automatically assigned an immutable tracking ID.',
    clearForm: 'Clear Form',
    submitRegister: '+ Register Household',
    regSuccessTitle: 'Household Registered Successfully',
    proceedToDistribute: 'Proceed to Distribute Ration',
    printQueueToken: 'Print Queue Token Slip',

    photoSectionTitle: 'Capture House / Damage Photo (Duplicate Verification)',
    photoSectionSubtitle: 'Snap or upload flood-damaged dwelling to automatically detect double claims.',
    modeCamera: 'Camera',
    modeUpload: 'Upload File',
    modeSamples: 'Test Samples',
    alignDwellingGuide: 'Align front view of affected dwelling',
    autoHashNotice: 'Automatic Perceptual Hashing',
    snapAndVerify: 'Snap & Verify',
    analyzing: 'Analyzing...',
    launchCamera: 'Launch Camera',
    cameraAccessError: 'Could not access camera (device permission denied or no camera available). Please use file upload below.',
    browsePhotoClick: 'Click to browse photo from computer or phone gallery',
    browsePhotoSupport: 'Supports JPEG, PNG, WebP · Automatically compresses for local storage',
    selectPhotoFile: 'Select Photo File',
    trySamplePhotos: 'Click any sample flood-damaged dwelling to test photo capture and duplicate matching:',
    trySamplePhotoLink: 'Try Sample Photo →',
    capturedDwellingPhoto: 'Captured Dwelling Photo',
    retakeReplace: 'Retake / Replace Photo',
    damageLevelLabel: 'Documented Flood Damage Level',
    damageSubmerged: 'Fully Submerged (Roof / Upper floors only visible)',
    damageSevere: 'Severe Inundation (Water level above 4-5 feet)',
    damagePartial: 'Partial Waterlogging (1-3 feet flood marks)',
    damageInundated: 'Courtyard / Surrounding Inundation',
    biometricVerificationTitle: 'Biometric & Visual Hash Verification',
    biometricVerificationDesc: 'Image converted to 256-bit perceptual gradient fingerprint to prevent repeated relief claiming using identical structure photos.',
    duplicateRiskAlert: 'High Duplicate Risk: Matching House Found in Registry!',
    duplicateRiskDesc: 'This house image has visual similarity with an already registered dwelling in the relief database:',
    newCapturedPhoto: 'Newly Captured Photo',
    matchedExistingRecord: 'Matched Existing Record',
    matchScore: 'Match',
    supervisorOverrideCheck: 'Field Officer Override: I inspected the site and confirm this is a distinct co-inhabitant or authorized multi-family joint residence.',
    uniqueDwellingVerified: 'Unique Dwelling Verified: No duplicate house photos detected in the relief registry (0 matches above 70% threshold).',

    distributeTitle: 'Distribute Ration Kits',
    distributeSubtitle: 'Verify household entitlement, prevent duplicate allocations per relief round, and log aid dispatches.',
    liveFieldCounter: 'Live Field Counter',
    locateHousehold: 'Locate Household (Search by ID, Name, Phone, or Village)',
    searchPlaceholder: 'e.g. FL-001 or Rameshwar or 98451...',
    changeFamily: 'Change',
    familyMembersCount: 'Family Members',
    rationKitType: 'Ration Kit Type',
    reliefRound: 'Relief Operation Round',
    roundHelp: 'Round quotas prevent duplicate double-claiming while allowing scheduled replenishments.',
    handoverDate: 'Handover Date',
    numberOfKits: 'Number of Kits Issued',
    standardQuotaHelp: 'Standard: 1 kit per 5 persons.',
    dispatchedByOfficer: 'Dispatched By / Camp Officer In-Charge',
    officerPlaceholder: 'e.g. Officer Rajesh K.',
    duplicateDistAlertTitle: 'Warning: Possible Duplicate Distribution',
    duplicateDistAlertDesc: 'This household has already received ration aid in this round:',
    duplicateOverrideCheck: 'I verified identity and confirm this approved additional distribution',
    overrideReasonLabel: 'Override Justification Note:',
    overrideReasonPlaceholder: 'e.g. Approved infant formula supplement / Extended joint household',
    recordDistributionBtn: 'Record Distribution',
    distSuccessTitle: 'Ration Distribution Recorded',
    printHandoverReceipt: 'Print Handover Receipt',
    recordNextHousehold: 'Record Next Household',

    searchHeaderTitle: 'Find & Verify Households',
    searchHeaderSubtitle: 'Live search across registered households by ID, name, mobile, or village.',
    searchBarPlaceholder: 'Search by ID (FL-001), Family Head Name, Mobile, Village...',
    filterAll: 'All',
    filterPending: 'Pending',
    filterDistributed: 'Distributed',
    filterVulnerable: 'Priority Needs',
    dwellingCol: 'Dwelling',
    statusCol: 'Status',
    statusGiven: 'Ration given',
    statusPending: 'Pending',
    noMatchingFound: 'No matching households found',
    resetFilters: 'Reset Filters',
    showingHouseholdsCount: 'Showing households',

    recordsTitle: 'Relief Operations Audit & Records',
    recordsSubtitle: 'Comprehensive ledger of registered households, distribution receipts, and inventory stocks.',
    exportFamiliesCsv: 'Export Families CSV',
    exportDistributionsCsv: 'Export Distributions CSV',
    tabHouseholds: 'Households Registry',
    tabLedger: 'Distribution Ledger',
    tabInventory: 'Ration Kit Inventory',
    dispatched: 'Dispatched',
    remainingBuffer: 'Remaining Buffer',
    totalStock: 'Total Stock',
    save: 'Save',
    resetDemoDataTitle: 'Reset / Reload Sample Relief Data',
    resetDemoDataDesc: 'Clear all customized records and restore initial emergency disaster relief seed data.',
    resetDemoDataBtn: 'Reset Demo Data',

    slipHeaderOrg: 'DISASTER RELIEF EMERGENCY RESPONSE',
    slipHeaderTitle: 'FloodRelief Official Ration Voucher',
    slipId: 'Slip ID',
    dateLabel: 'Date',
    verifiedDwellingBadge: 'Verified Dwelling',
    verifiedHandoverRecord: 'Verified Handover Record',
    kitAllocated: 'Kit Allocated',
    dispatchedBy: 'Dispatched By',
    queueTokenNoticeTitle: 'Queue Entitlement Token',
    queueTokenNoticeDesc: 'Present this physical token slip at the ration dispatch counter or distribution truck.',
    recipientSignature: 'Recipient Signature / Thumb Impression',
    officerSeal: 'Camp Distribution Officer Seal & Signature',
    printReceiptBtn: 'Print Receipt',
    closeBtn: 'Close',

    footerHub: 'FloodRelief Operations Hub',
    footerLocalNotice: 'Field data stored in Cloud Firestore & local cache. Download CSV backups regularly before shifting personnel.',
  },
  hi: {
    appTitle: 'बाढ़ राहत (FloodRelief)',
    dashboard: 'डैशबोर्ड',
    register: 'पंजीकरण',
    distribute: 'राशन वितरण',
    search: 'खोजें',
    records: 'अभिलेख',
    quickDispatch: 'त्वरित वितरण',
    cloudSyncing: 'क्लाउड सिंक हो रहा है...',
    cloudLive: 'क्लाउड 50k+ सक्रिय',

    registeredHouseholds: 'पंजीकृत परिवार',
    priorityVulnerable: 'प्राथमिकता / संवेदनशील',
    householdsReached: 'राशन प्राप्त परिवार',
    coverageAchieved: 'कवरेज पूरा हुआ',
    noHouseholdsAdded: 'कोई परिवार नहीं जुड़ा',
    pendingHouseholds: 'प्रतीक्षारत परिवार',
    awaitingAllocation: 'वितरण की प्रतीक्षा में',
    kitsDispatched: 'वितरित राशन किट',
    acrossAllRounds: 'सभी राहत चरणों में कुल',
    bannerTitle: 'सक्रिय बाढ़ राहत अभियान — स्थानीय व क्लाउड प्रबंधन',
    bannerDesc: 'डुप्लीकेट फोन और दोहराव रोकथाम प्रणाली के साथ सुरक्षित राहत शिविर पोर्टल। शिफ्ट समाप्ति से पहले सीएसवी बैकअप अवश्य लें।',
    registerHouseholdBtn: '+ नया परिवार जोड़ें',
    recordDispatchBtn: 'राशन वितरण दर्ज करें',
    exportCsvBtn: 'सीएसवी डाउनलोड',
    recentDistributionsTitle: 'हालिया राशन वितरण सूची',
    recentDistributionsSubtitle: 'सत्यापित पारिवारिक सहायता वितरण का लाइव रिकॉर्ड',
    viewFullLedger: 'पूरा बहीखाता देखें',
    noDistributionsYet: 'अभी कोई वितरण दर्ज नहीं हुआ है। परिवार पंजीकृत कर राशन वितरण प्रारंभ करें।',
    householdCol: 'परिवार',
    kitTypeCol: 'किट प्रकार',
    villageCol: 'गाँव / क्षेत्र',
    qtyCol: 'मात्रा',
    actionsCol: 'कार्य',
    printSlip: 'पर्ची प्रिंट',
    areaCoverageProgress: 'क्षेत्रवार राहत कवरेज',
    campStockStatus: 'शिविर किट स्टॉक स्थिति',
    manage: 'प्रबंधन',
    issued: 'वितरित',
    left: 'शेष',
    duplicateProtocolTitle: 'दोहराव रोकथाम नियम:',
    duplicateProtocolDesc: 'सिस्टम एक ही चरण में दोबारा वितरण की जाँच करता है। सुपरवाइजर अनुमति देने से पहले पहचान पत्र अवश्य सत्यापित करें।',

    registerTitle: 'बाढ़ प्रभावित परिवार का पंजीकरण',
    registerSubtitle: 'राहत हकदारी, राशन कोटा और सुरक्षा ट्रैकिंग हेतु प्रभावित परिवारों को नामांकित करें।',
    assignedId: 'आवंटित आईडी',
    familyHeadName: 'परिवार के मुखिया का नाम',
    familyHeadPlaceholder: 'उदा. रामेश्वर कुमार प्रसाद',
    mobileNumber: 'प्राथमिक मोबाइल नंबर',
    mobilePlaceholder: '10 अंकों का मोबाइल नंबर',
    mobileHelp: 'दोहराव रोकने व आपातकालीन सूचना के लिए उपयोग किया जाता है।',
    alreadyRegisteredUnder: 'यह नंबर पहले से इस नाम पर पंजीकृत है:',
    villageWard: 'गाँव / जलमग्न वार्ड / बस्ती',
    villagePlaceholder: 'उदा. रामपुर वार्ड 3, निचला क्षेत्र',
    assignedCamp: 'आवंटित राहत शिविर / शरण स्थल',
    familySize: 'परिवार के कुल सदस्य',
    persons: 'व्यक्ति',
    extendedFamilyEligible: '(बड़ा संयुक्त परिवार - दोहरी किट हेतु पात्र)',
    specialNeedsNotes: 'विशेष आवश्यकता / चिकित्सीय टिप्पणी (वैकल्पिक)',
    specialNotesPlaceholder: 'उदा. इंसुलिन निर्भर, व्हीलचेयर आवश्यक',
    vulnerabilityFlagsTitle: 'संवेदनशीलता संकेतक (प्राथमिकता किट हेतु)',
    flagInfant: 'शिशु / छोटा बच्चा (< 2 वर्ष)',
    flagPregnant: 'गर्भवती / धात्री महिला',
    flagElderly: 'बुजुर्ग (65+ वर्ष)',
    flagDisabled: 'दिव्यांग व्यक्ति',
    flagSingleParent: 'एकल अभिभावक परिवार',
    autoIdNotice: 'परिवार को एक अद्वितीय अपरिवर्तनीय ट्रैकिंग आईडी स्वतः आवंटित होगी।',
    clearForm: 'फॉर्म साफ करें',
    submitRegister: '+ परिवार पंजीकृत करें',
    regSuccessTitle: 'परिवार का पंजीकरण सफलतापूर्वक हुआ',
    proceedToDistribute: 'राशन वितरण के लिए आगे बढ़ें',
    printQueueToken: 'कतार टोकन पर्ची प्रिंट करें',

    photoSectionTitle: 'मकान / क्षति की फोटो (डुप्लीकेट जाँच)',
    photoSectionSubtitle: 'एक ही मकान पर बार-बार राहत लेने की धोखाधड़ी रोकने हेतु मकान की फोटो लें या अपलोड करें।',
    modeCamera: 'कैमरा',
    modeUpload: 'फोटो अपलोड',
    modeSamples: 'टेस्ट सैंपल',
    alignDwellingGuide: 'मकान का सामने का दृश्य फ्रेम में रखें',
    autoHashNotice: 'स्वचालित विज़ुअल हैशिंग',
    snapAndVerify: 'फोटो खींचें व जाँचें',
    analyzing: 'जाँच जारी है...',
    launchCamera: 'कैमरा शुरू करें',
    cameraAccessError: 'कैमरा एक्सेस नहीं हो सका (अनुमति अस्वीकृत या कैमरा उपलब्ध नहीं)। कृपया नीचे फोटो अपलोड विकल्प चुनें।',
    browsePhotoClick: 'कंप्यूटर या मोबाइल गैलरी से फोटो चुनने के लिए क्लिक करें',
    browsePhotoSupport: 'JPEG, PNG, WebP समर्थित · स्टोरेज बचाने के लिए स्वतः कंप्रेस होगी',
    selectPhotoFile: 'फोटो फाइल चुनें',
    trySamplePhotos: 'फोटो खींचने और डुप्लीकेट मैचिंग टेस्ट करने के लिए सैंपल मकान पर क्लिक करें:',
    trySamplePhotoLink: 'सैंपल फोटो आजमाएँ →',
    capturedDwellingPhoto: 'कैप्चर की गई मकान की फोटो',
    retakeReplace: 'फोटो दोबारा लें / बदलें',
    damageLevelLabel: 'बाढ़ क्षति की स्थिति',
    damageSubmerged: 'पूरी तरह जलमग्न (केवल छत / ऊपरी मंजिल दृश्यमान)',
    damageSevere: 'गंभीर जलभराव (पानी 4-5 फीट से ऊपर)',
    damagePartial: 'आंशिक जलभराव (1-3 फीट पानी के निशान)',
    damageInundated: 'आँगन / आस-पास जलभराव',
    biometricVerificationTitle: 'विज़ुअल हैश व डुप्लीकेट सुरक्षा जाँच',
    biometricVerificationDesc: 'फोटो को 256-बिट विज़ुअल फिंगरप्रिंट में बदलकर यह सुनिश्चित किया जाता है कि एक ही मकान की फोटो से दोबारा क्लेम न किया जा सके।',
    duplicateRiskAlert: 'उच्च डुप्लीकेट खतरा: इस मकान की फोटो पहले से पंजीकृत है!',
    duplicateRiskDesc: 'इस मकान की फोटो का डेटाबेस में पहले से मौजूद मकान के साथ मेल पाया गया है:',
    newCapturedPhoto: 'नई ली गई फोटो',
    matchedExistingRecord: 'पहले से मौजूद रिकॉर्ड',
    matchScore: 'समानता',
    supervisorOverrideCheck: 'फील्ड ऑफिसर अधिप्रमाणन: मैंने स्थल निरीक्षण किया है और पुष्टि करता हूँ कि यह अलग सह-निवासी या स्वीकृत संयुक्त परिवार है।',
    uniqueDwellingVerified: 'अद्वितीय मकान सत्यापित: डेटाबेस में कोई डुप्लीकेट मकान की फोटो नहीं मिली (70% से अधिक कोई मेल नहीं)।',

    distributeTitle: 'राशन किट वितरण',
    distributeSubtitle: 'परिवार की पात्रता जाँचें, एक ही राउंड में दोहराव रोकें, और वितरण दर्ज करें।',
    liveFieldCounter: 'लाइव वितरण काउंटर',
    locateHousehold: 'परिवार खोजें (आईडी, नाम, मोबाइल या गाँव से)',
    searchPlaceholder: 'उदा. FL-001 या रामेश्वर या 98451...',
    changeFamily: 'बदलें',
    familyMembersCount: 'परिवार के सदस्य',
    rationKitType: 'राशन किट का प्रकार',
    reliefRound: 'राहत अभियान चरण / राउंड',
    roundHelp: 'राउंड कोटा प्रणाली यह सुनिश्चित करती है कि दोबारा क्लेम न हो, जबकि समयबद्ध दोबारा राशन दिया जा सके।',
    handoverDate: 'वितरण की तिथि',
    numberOfKits: 'दी जाने वाली किट संख्या',
    standardQuotaHelp: 'मानक: प्रत्येक 5 सदस्यों पर 1 किट।',
    dispatchedByOfficer: 'वितरणकर्ता / शिविर प्रभारी अधिकारी',
    officerPlaceholder: 'उदा. अधिकारी राजेश के.',
    duplicateDistAlertTitle: 'चेतावनी: संभावित दोहराव वितरण',
    duplicateDistAlertDesc: 'इस परिवार को इस राउंड में पहले ही राशन सहायता मिल चुकी है:',
    duplicateOverrideCheck: 'मैंने पहचान सत्यापित कर ली है और इस अतिरिक्त वितरण को स्वीकृति देता हूँ',
    overrideReasonLabel: 'अतिरिक्त वितरण का कारण:',
    overrideReasonPlaceholder: 'उदा. शिशु पोषण हेतु विशेष स्वीकृति / बड़ा संयुक्त परिवार',
    recordDistributionBtn: 'वितरण दर्ज करें',
    distSuccessTitle: 'राशन वितरण दर्ज किया गया',
    printHandoverReceipt: 'वितरण रसीद प्रिंट करें',
    recordNextHousehold: 'अगले परिवार का वितरण करें',

    searchHeaderTitle: 'परिवार खोजें व सत्यापित करें',
    searchHeaderSubtitle: 'आईडी, नाम, मोबाइल या गाँव द्वारा पंजीकृत परिवारों में लाइव खोज।',
    searchBarPlaceholder: 'आईडी (FL-001), मुखिया का नाम, मोबाइल, गाँव द्वारा खोजें...',
    filterAll: 'सभी',
    filterPending: 'प्रतीक्षारत',
    filterDistributed: 'वितरित',
    filterVulnerable: 'विशेष आवश्यकता',
    dwellingCol: 'मकान फोटो',
    statusCol: 'स्थिति',
    statusGiven: 'राशन दिया गया',
    statusPending: 'प्रतीक्षारत',
    noMatchingFound: 'कोई मिलता-जुलता परिवार नहीं मिला',
    resetFilters: 'फ़िल्टर हटाएं',
    showingHouseholdsCount: 'प्रदर्शित परिवार',

    recordsTitle: 'राहत कार्य ऑडिट व अभिलेख',
    recordsSubtitle: 'पंजीकृत परिवारों, वितरण रसीदों और किट स्टॉक की विस्तृत बहीखाता सूची।',
    exportFamiliesCsv: 'परिवार सूची CSV',
    exportDistributionsCsv: 'वितरण बहीखाता CSV',
    tabHouseholds: 'परिवार पंजिका',
    tabLedger: 'वितरण बहीखाता',
    tabInventory: 'राशन किट स्टॉक',
    dispatched: 'कुल वितरित',
    remainingBuffer: 'शेष बफर स्टॉक',
    totalStock: 'कुल आवक स्टॉक',
    save: 'सहेजें',
    resetDemoDataTitle: 'डेमो डेटा रीसेट / रीलोड करें',
    resetDemoDataDesc: 'सभी बदलाव हटाकर आपातकालीन राहत का प्रारंभिक डेटा रीस्टोर करें।',
    resetDemoDataBtn: 'डेटा रीसेट करें',

    slipHeaderOrg: 'आपदा राहत एवं आपातकालीन प्रबंधन',
    slipHeaderTitle: 'बाढ़ राहत आधिकारिक राशन वाउचर',
    slipId: 'पर्ची संख्या',
    dateLabel: 'दिनांक',
    verifiedDwellingBadge: 'सत्यापित मकान',
    verifiedHandoverRecord: 'सत्यापित राहत वितरण रिकॉर्ड',
    kitAllocated: 'आवंटित किट',
    dispatchedBy: 'वितरण अधिकारी',
    queueTokenNoticeTitle: 'कतार पात्रता टोकन',
    queueTokenNoticeDesc: 'राशन वितरण काउंटर या ट्रक पर यह भौतिक पर्ची टोकन प्रस्तुत करें।',
    recipientSignature: 'प्राप्तकर्ता के हस्ताक्षर / अंगूठे का निशान',
    officerSeal: 'शिविर वितरण अधिकारी की मुहर व हस्ताक्षर',
    printReceiptBtn: 'रसीद प्रिंट करें',
    closeBtn: 'बंद करें',

    footerHub: 'बाढ़ राहत संचालन केंद्र',
    footerLocalNotice: 'डेटा क्लाउड फायरस्टोर व लोकल कैशे में सुरक्षित है। शिफ्ट समाप्ति से पहले नियमित CSV बैकअप लें।',
    langEnglish: 'English',
    langHindi: 'हिन्दी',
    chooseLanguage: 'भाषा चुनें',
    householdDetailsTitle: 'परिवार राहत प्रोफ़ाइल',
    quickDistributeBtn: 'राशन किट जारी करें',
    damageAssessed: 'आंकलित बाढ़ क्षति',
    totalKitsReceived: 'प्राप्त कुल किट',
    distributionHistory: 'वितरण का इतिहास',
    noDistributionHistory: 'इस परिवार के लिए अभी कोई वितरण दर्ज नहीं हुआ है।',
    registeredOn: 'पंजीकृत तिथि',
  },
};
