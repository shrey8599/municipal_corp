// Language Translations System
const translations = {
    en: {
        // Navigation & Header
        'nav.dashboard': 'Dashboard',
        'nav.newComplaint': 'New Complaint',
        'nav.myComplaints': 'My Complaints',
        'nav.contactOfficer': 'Contact Ward Officer',
        'nav.profile': 'Profile',
        'nav.logout': 'Logout',
        'nav.language': 'Language',
        
        // My Tickets Page
        'tickets.title': 'My Complaints',
        'tickets.fileNew': 'File New Complaint',
        'tickets.notice': 'Please Submit Complaints Responsibly',
        'tickets.noticeText': 'We encourage you to submit complaints only when necessary. Please take time to review existing processes and communicate directly with your ward officer when possible. Excessive or duplicate complaints can strain the municipal system and delay assistance to those who need it most. Together, let\'s work efficiently to maintain our community.',
        'tickets.assigned': 'Assigned Complaints',
        'tickets.open': 'Open',
        'tickets.inProgress': 'In Progress',
        'tickets.resolved': 'Resolved',
        'tickets.openComplaints': 'Open Complaints',
        'tickets.inProgressComplaints': 'In Progress',
        'tickets.resolvedComplaints': 'Resolved',
        'tickets.totalComplaints': 'Total Complaints',
        'tickets.total': 'Total Complaints',
        'tickets.recent': 'Recent Complaints',
        'tickets.refresh': 'Refresh',
        'tickets.filing': 'File Your First Complaint',
        'tickets.none': 'No complaints assigned',
        'tickets.noneYet': 'No complaints yet',
        'tickets.noComplaints': 'No complaints',
        'tickets.statusOpen': 'Open',
        'tickets.statusInProgress': 'In Progress',
        'tickets.statusResolved': 'Resolved / Closed',
        'tickets.failedToLoad': 'Failed to load complaints. Please try again.',
        'tickets.callNow': 'Call Now',
        'tickets.emailNow': 'Email Now',
        'tickets.quickActionInProgress': 'In Progress',
        'tickets.quickActionResolved': 'Resolved',
        'tickets.quickActionAddComment': 'Add Comment',
        'tickets.quickActionViewDetails': 'View Details',
        
        // Ticket Details Page
        'ticketDetails.back': 'Back to Complaints',
        'ticketDetails.title': 'Complaint Details',
        'ticketDetails.category': 'Category',
        'ticketDetails.type': 'Type',
        'ticketDetails.status': 'Status',
        'ticketDetails.filedBy': 'Filed by',
        'ticketDetails.assignedTo': 'Assigned to',
        'ticketDetails.created': 'Created',
        'ticketDetails.lastUpdated': 'Last Updated',
        'ticketDetails.closed': 'Closed',
        'ticketDetails.description': 'Description',
        'ticketDetails.resolutionNote': 'Resolution Note',
        'ticketDetails.contactCitizen': 'Contact citizen',
        'ticketDetails.callNow': 'Call Now',
        'ticketDetails.emailNow': 'Email Now',
        'ticketDetails.noPhone': 'No phone on file',
        'ticketDetails.noEmail': 'No email on file',
        'ticketDetails.leaderActions': 'Leader Actions',
        'ticketDetails.markInProgress': 'Mark In Progress',
        'ticketDetails.markResolved': 'Mark Resolved',
        'ticketDetails.comments': 'Comments & Updates',
        'ticketDetails.addComment': 'Add a Comment',
        'ticketDetails.placeholderComment': 'Add your comment or update...',
        'ticketDetails.postComment': 'Post Comment',
        'ticketDetails.noComments': 'No comments yet. Be the first to comment!',
        'ticketDetails.markAsResolved': 'Mark Ticket as Resolved',
        'ticketDetails.resolutionNoteOptional': 'Resolution Note (Optional)',
        'ticketDetails.enterResolutionDetails': 'Enter resolution details (optional)...',
        'ticketDetails.cancel': 'Cancel',
        'ticketDetails.resolveWithoutNote': 'Resolve Without Note',
        'ticketDetails.addNoteResolve': 'Add Note & Resolve',
        'ticketDetails.ticketIdNotFound': 'Ticket ID not found',
        'ticketDetails.failedToLoad': 'Failed to load ticket details',
        'ticketDetails.noTicketLoaded': 'No ticket loaded',
        'ticketDetails.markedAsResolved': 'Ticket marked as resolved',
        'ticketDetails.markedWithNote': 'Ticket marked as resolved with note',
        'ticketDetails.failedToResolve': 'Failed to resolve ticket',
        'ticketDetails.statusUpdated': 'Status updated successfully',
        'ticketDetails.statusUpdateFailed': 'Failed to update status',
        'ticketDetails.confirmStatusUpdate': 'Are you sure you want to mark this ticket as',
        'ticketDetails.enterResolutionNote': 'Please enter a resolution note or use "Resolve Without Note"',
        'ticketDetails.commentAdded': 'Comment added successfully',
        'ticketDetails.commentFailed': 'Failed to add comment',
        'ticketDetails.unableToAddComment': 'Unable to add comment',
        
        // Contact Officer Page
        'contact.title': 'Your Ward Officer',
        'contact.loading': 'Loading ward officer information...',
        'contact.noAssigned': 'No ward officer is assigned to your area yet.',
        'contact.contactOffice': 'Please contact the Municipal Corporation office for assistance.',
        'contact.ward': 'Ward Number',
        'contact.phone': 'Phone',
        'contact.email': 'Email',
        'contact.note': 'Note',
        'contact.noteText': 'Your ward officer is here to help resolve complaints and issues in your area. Feel free to reach out for any assistance or updates on your complaints.',
        'contact.callNow': 'Call Now',
        'contact.sendEmail': 'Send Email',
        'contact.viewComplaints': 'View My Complaints',
        'contact.leaderDesignation': 'Ward Officer',
        'contact.loadError': 'Failed to load leader information:',
        'contact.notAuthorized': 'This page is only for citizens',
        'contact.userNotFound': 'User information not found',
        'contact.leaderNotFound': 'Failed to load user information',
        
        // Profile Page
        'profile.title': 'Profile',
        'profile.name': 'Name',
        'profile.phone': 'Phone',
        'profile.email': 'Email',
        'profile.address': 'Address',
        'profile.ward': 'Ward Number',
        'profile.designation': 'Designation',
        'profile.readOnly': 'Read-only',
        'profile.save': 'Save',
        'profile.cancel': 'Cancel',
        'profile.changing': 'Changing this will require OTP verification',
        'profile.help': 'How to Update Your Profile',
        'profile.helpText1': 'Click the ✏️ icon next to any field to edit it',
        'profile.helpText2': 'For Phone and Email changes, you\'ll need to verify with OTP for security',
        'profile.helpText3': 'Other fields can be updated immediately',
        'profile.helpText4': 'Ward Number cannot be changed (assigned by admin)',
        'profile.updated': 'updated successfully',
        'profile.failed': 'Failed to update',
        'profile.verifyOTP': 'Verify OTP',
        'profile.sendOTP': 'Send OTP',
        
        // Create Ticket Page
        'createTicket.title': 'Create New Complaint',
        'createTicket.subtitle': 'Report an issue in your area',
        'createTicket.typeLabel': 'Complaint Type',
        'createTicket.typeComplaint': 'Complaint',
        'createTicket.typeRequest': 'Service Request',
        'createTicket.typeSuggestion': 'Suggestion',
        'createTicket.titleLabel': 'Title',
        'createTicket.titlePlaceholder': 'Brief description of the issue',
        'createTicket.description': 'Description',
        'createTicket.descriptionPlaceholder': 'Provide more details about the problem',
        'createTicket.category': 'Category',
        'createTicket.categoryPlaceholder': 'Select Category',
        'createTicket.categoryStreetLights': '🔦 Street Lights',
        'createTicket.categoryRoads': '🛣️ Roads & Potholes',
        'createTicket.categoryWater': '💧 Water Supply',
        'createTicket.categoryGarbage': '🗑️ Garbage Collection',
        'createTicket.categorySewage': '🚰 Sewage & Drainage',
        'createTicket.categoryParks': '🌳 Parks & Gardens',
        'createTicket.categoryOthers': '📋 Others',
        'createTicket.type': 'Type',
        'createTicket.images': 'Upload Photos (Optional)',
        'createTicket.imagesHint': 'You can select up to 5 images (each max 10MB)',
        'createTicket.uploadPrompt': 'Click to upload photos',
        'createTicket.fileFormat': 'JPEG, PNG, GIF (Max 10MB each)',
        'createTicket.selectImages': 'You can select multiple images',
        'createTicket.submit': 'Submit Complaint',
        'createTicket.submitting': 'Submitting...',
        'createTicket.cancel': 'Cancel',
        'createTicket.required': 'Required field',
        'createTicket.fileTooLarge': 'is too large. Max 10MB.',
        'createTicket.invalidFormat': 'is not a supported image format.',
        'createTicket.uploadSuccess': 'uploaded successfully',
        'createTicket.uploadFailed': 'Failed to upload',
        'createTicket.userNotFound': 'User information not found',
        'createTicket.submitSuccess': 'Complaint submitted successfully!',
        'createTicket.submitFailed': 'Failed to submit complaint',
        
        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.leaderProfile': 'Ward Officer Profile',
        'dashboard.serving': 'Serving with dedication, building tomorrow together',
        'dashboard.vision': 'Our Mission & Vision',
        'dashboard.visionText': 'We are committed to creating a cleaner, safer, and more prosperous community for all residents. Through transparent governance, swift problem resolution, and continuous infrastructure development, we aim to make our ward the best place to live, work, and grow. Your voice matters, your concerns are our priority, and together we build a brighter future.',
        'dashboard.news': 'News & Announcements',
        'dashboard.newsFrom': 'Latest News & Updates from Your Ward Officer',
        'dashboard.myUpdates': 'My Updates & Announcements',
        'dashboard.noNews': 'No news or announcements yet.',
        'dashboard.addNews': 'Add News',
        'dashboard.onlyForOfficers': 'Only ward officers can add news',
        'dashboard.allNews': 'News retrieved successfully',
        
        // Alerts & Messages
        'alert.error': 'Error',
        'alert.success': 'Success',
        'alert.loading': 'Loading...',
        'alert.failed': 'Failed to load',
        'alert.tryAgain': 'Please try again',
        'alert.notFound': 'Not found',
        'alert.fieldRequired': 'is required',
        'alert.fieldEmpty': 'cannot be empty',
        'alert.invalidEmail': 'Invalid email address',
        
        // Status values
        'status.open': 'Open',
        'status.pending': 'Pending',
        'status.inProgress': 'In Progress',
        'status.resolved': 'Resolved',
        'status.closed': 'Closed',
        
        // Profile Page (Fields & Labels)
        'profile.personalInfo': 'Personal Information',
        'profile.fieldName': 'Name',
        'profile.fieldPhone': 'Phone',
        'profile.fieldEmail': 'Email',
        'profile.fieldAddress': 'Address',
        'profile.fieldWardNumber': 'Ward Number',
        'profile.fieldDesignation': 'Designation',
        'profile.fieldJurisdiction': 'Ward Number',
        'profile.readOnlyBadge': 'Read-only',
        'profile.editButton': 'Edit',
        'profile.saveButton': 'Save',
        'profile.cancelButton': 'Cancel',
        'profile.verifyOTPModal': 'Verify Phone/Email Change',
        'profile.sendOTPButton': 'Send OTP',
        'profile.verifyButton': 'Verify & Update',
        'profile.resendOTPButton': 'Resend OTP',
        'profile.closeButton': 'Close',
        'profile.notSet': 'Not set',
        'profile.changeWarning': 'Changing this will require OTP verification',
        'profile.updateSuccess': 'updated successfully',
        'profile.updateFailed': 'Failed to update',
        'profile.emptyFieldError': 'cannot be empty',
        'profile.sentOTP': 'OTP sent to',
        'profile.otpSendFailed': 'Failed to send OTP',
        'profile.invalidOTP': 'Please enter a valid 6-digit OTP',
        'profile.otpVerifiedSuccess': 'OTP verified successfully',
        'profile.loadProfileFailed': 'Failed to load profile',
        'profile.fileSizeTooLarge': 'File size must be less than 5MB',
        'profile.invalidFileType': 'Only JPEG and PNG images are allowed',
        'profile.notLoggedIn': 'You are not logged in. Please login again.',
        'profile.sessionExpired': 'Your session has expired. Please login again.',
        'profile.profilePictureUpdated': 'Profile picture updated successfully',
        'profile.uploadFailed': 'Failed to upload profile picture',
        
        // Auth & Login Page
        'auth.title': 'Login or Register',
        'auth.phoneStep': 'Enter Your Phone Number',
        'auth.phoneLabel': 'Phone Number',
        'auth.phonePlaceholder': 'Enter 10-digit mobile number',
        'auth.phoneHint': 'We\'ll send you an OTP to verify',
        'auth.roleLabel': 'I am a',
        'auth.roleCitizen': 'Citizen',
        'auth.roleLeader': 'Ward Officer',
        'auth.sendOTPButton': 'Send OTP',
        'auth.otpStep': 'Enter OTP',
        'auth.otpSentTo': 'OTP sent to',
        'auth.otpLabel': 'OTP Code',
        'auth.otpPlaceholder': 'Enter 6-digit OTP',
        'auth.otpValid': 'Valid for 5 minutes',
        'auth.verifyOTPButton': 'Verify OTP',
        'auth.backButton': 'Back',
        'auth.registerStep': 'Complete Registration',
        'auth.fullNameLabel': 'Full Name',
        'auth.fullNamePlaceholder': 'Enter your full name',
        'auth.emailLabel': 'Email',
        'auth.emailPlaceholder': 'Enter your email',
        'auth.addressLabel': 'Address',
        'auth.addressPlaceholder': 'Enter your complete address',
        'auth.wardNumberLabel': 'Ward Number',
        'auth.wardNumberPlaceholder': 'e.g., 15',
        'auth.wardOfficerLabel': 'Ward Officer',
        'auth.wardOfficerSelect': 'Select...',
        'auth.registerButton': 'Complete Registration',
        'auth.backToHome': 'Back to Home',
        'auth.requiredField': 'Required field',
        
        // Home/Index Page
        'home.title': 'Municipal Corporation',
        'home.subtitle': 'Complaint Management System',
        'home.tagline': 'Your Voice, Our Responsibility',
        'home.getStarted': 'Get Started',
        'home.learnMore': 'Learn More',
        'home.featureEasyRegistration': 'Easy Registration',
        'home.featureEasyRegDesc': 'Register using mobile OTP authentication. Quick and secure.',
        'home.featureFileComplaints': 'File Complaints',
        'home.featureFileCompDesc': 'Report issues like street lights, roads, water supply, and more.',
        'home.featureUploadPhotos': 'Upload Photos',
        'home.featureUploadPhotosDesc': 'Add photo evidence to your complaints for faster resolution.',
        'home.featureTrackStatus': 'Track Status',
        'home.featureTrackStatusDesc': 'Real-time updates on your complaint status and resolution.',
        'home.featureCommunication': 'Communication',
        'home.featureCommunicationDesc': 'Chat with ward officers and get updates on your complaints.',
        'home.featureFastResolution': 'Fast Resolution',
        'home.featureFastResDesc': 'Direct assignment to ward officers for quick action.',
        'home.statsResolved': 'Complaints Resolved',
        'home.statsOfficers': 'Ward Officers',
        'home.statsAvailable': 'Service Available',
        'home.statsSatisfaction': 'Satisfaction Rate',
        'home.ctaTitle': 'Ready to Make a Difference?',
        'home.ctaSubtitle': 'Join thousands of citizens in making our city better',
        'home.ctaButton': 'Register Now',
        'home.footerCopyright': '© 2026 Municipal Corporation. All rights reserved.',
        'home.footerEmergency': 'For emergencies, call: 100 | Email: support@municipal.gov',
        
        // Personal Information / Profile
        'common.personalInfo': 'Personal Information',
        'common.recentComplaints': 'Recent Complaints',
        'common.howToEdit': 'How to Update Your Profile',
        'common.note': 'Note',
        'common.submit': 'Submit',
        'common.cancel': 'Cancel',
        'common.save': 'Save Changes',
        'common.publishNews': 'Publish News',
        
        // Contact Officer Page
        'contact.leaderInfo': 'Ward Officer Information',
        'contact.leaderNote': 'Your ward officer is here to help resolve complaints and issues in your area. Feel free to reach out for any assistance or updates on your complaints.'
    },
    hi: {
        // Navigation & Header
        'nav.dashboard': 'डैशबोर्ड',
        'nav.newComplaint': 'नई शिकायत',
        'nav.myComplaints': 'मेरी शिकायतें',
        'nav.contactOfficer': 'वार्ड अधिकारी से संपर्क करें',
        'nav.profile': 'प्रोफाइल',
        'nav.logout': 'लॉगआउट',
        'nav.language': 'भाषा',
        
        // My Tickets Page
        'tickets.title': 'मेरी शिकायतें',
        'tickets.fileNew': 'नई शिकायत दर्ज करें',
        'tickets.notice': 'कृपया जिम्मेदारी से शिकायतें प्रस्तुत करें',
        'tickets.noticeText': 'हम आपको केवल आवश्यकता होने पर शिकायतें प्रस्तुत करने के लिए प्रोत्साहित करते हैं। कृपया मौजूदा प्रक्रियाओं की समीक्षा करने के लिए समय लें और जहां संभव हो अपने वार्ड अधिकारी से सीधे संवाद करें। अत्यधिक या डुप्लिकेट शिकायतें नगर निगम की प्रणाली को तनाव में डाल सकती हैं और उन लोगों को सहायता में देरी कर सकती हैं जिन्हें इसकी सबसे अधिक आवश्यकता है। आइए मिलकर हमारे समुदाय को कुशलतापूर्वक बनाए रखें।',
        'tickets.assigned': 'सौंपी गई शिकायतें',
        'tickets.open': 'खुली',
        'tickets.inProgress': 'प्रक्रिया में',
        'tickets.resolved': 'हल की गई',
        'tickets.openComplaints': 'खुली शिकायतें',
        'tickets.inProgressComplaints': 'प्रक्रिया में',
        'tickets.resolvedComplaints': 'हल की गई',
        'tickets.totalComplaints': 'कुल शिकायतें',
        'tickets.total': 'कुल शिकायतें',
        'tickets.recent': 'हाल की शिकायतें',
        'tickets.refresh': 'ताज़ा करें',
        'tickets.filing': 'अपनी पहली शिकायत दर्ज करें',
        'tickets.none': 'कोई शिकायत सौंपी नहीं गई',
        'tickets.noneYet': 'अभी तक कोई शिकायत नहीं',
        'tickets.noComplaints': 'कोई शिकायत नहीं',
        'tickets.statusOpen': 'खुली',
        'tickets.statusInProgress': 'प्रक्रिया में',
        'tickets.statusResolved': 'हल की गई / बंद की गई',
        'tickets.failedToLoad': 'शिकायतें लोड करने में विफल। कृपया फिर से प्रयास करें।',
        'tickets.callNow': 'अभी कॉल करें',
        'tickets.emailNow': 'ईमेल भेजें',
        'tickets.quickActionInProgress': 'प्रक्रिया में',
        'tickets.quickActionResolved': 'हल किया गया',
        'tickets.quickActionAddComment': 'कमेंट जोड़ें',
        'tickets.quickActionViewDetails': 'विवरण देखें',
        
        // Ticket Details Page
        'ticketDetails.back': 'शिकायतों पर वापस जाएं',
        'ticketDetails.title': 'शिकायत विवरण',
        'ticketDetails.category': 'श्रेणी',
        'ticketDetails.type': 'प्रकार',
        'ticketDetails.status': 'स्थिति',
        'ticketDetails.filedBy': 'दर्ज किया गया',
        'ticketDetails.assignedTo': 'निर्दिष्ट',
        'ticketDetails.created': 'बनाया गया',
        'ticketDetails.lastUpdated': 'अंतिम अपडेट',
        'ticketDetails.closed': 'बंद किया गया',
        'ticketDetails.description': 'विवरण',
        'ticketDetails.resolutionNote': 'समाधान नोट',
        'ticketDetails.contactCitizen': 'नागरिक से संपर्क करें',
        'ticketDetails.callNow': 'अभी कॉल करें',
        'ticketDetails.emailNow': 'ईमेल भेजें',
        'ticketDetails.noPhone': 'फाइल पर कोई फोन नहीं',
        'ticketDetails.noEmail': 'फाइल पर कोई ईमेल नहीं',
        'ticketDetails.leaderActions': 'नेता कार्रवाई',
        'ticketDetails.markInProgress': 'प्रगति पर चिह्नित करें',
        'ticketDetails.markResolved': 'हल हुआ चिह्नित करें',
        'ticketDetails.comments': 'कमेंट & अपडेट',
        'ticketDetails.addComment': 'एक कमेंट जोड़ें',
        'ticketDetails.placeholderComment': 'अपना कमेंट या अपडेट जोड़ें...',
        'ticketDetails.postComment': 'कमेंट पोस्ट करें',
        'ticketDetails.noComments': 'अभी तक कोई कमेंट नहीं। पहला कमेंट करने वाले बनें!',
        'ticketDetails.markAsResolved': 'टिकट को समाधान के रूप में चिह्नित करें',
        'ticketDetails.resolutionNoteOptional': 'समाधान नोट (वैकल्पिक)',
        'ticketDetails.enterResolutionDetails': 'समाधान विवरण दर्ज करें (वैकल्पिक)...',
        'ticketDetails.cancel': 'रद्द करें',
        'ticketDetails.resolveWithoutNote': 'नोट के बिना समाधान करें',
        'ticketDetails.addNoteResolve': 'नोट जोड़ें & समाधान करें',
        'ticketDetails.ticketIdNotFound': 'टिकट ID नहीं मिला',
        'ticketDetails.failedToLoad': 'टिकट विवरण लोड करने में विफल',
        'ticketDetails.noTicketLoaded': 'कोई टिकट लोड नहीं किया गया',
        'ticketDetails.markedAsResolved': 'टिकट को समाधान के रूप में चिह्नित किया गया',
        'ticketDetails.markedWithNote': 'टिकट को नोट के साथ समाधान के रूप में चिह्नित किया गया',
        'ticketDetails.failedToResolve': 'टिकट को समाधान करने में विफल',
        'ticketDetails.statusUpdated': 'स्थिति सफलतापूर्वक अपडेट की गई',
        'ticketDetails.statusUpdateFailed': 'स्थिति अपडेट करने में विफल',
        'ticketDetails.confirmStatusUpdate': 'क्या आप इस टिकट को इस रूप में चिह्नित करना चाहते हैं',
        'ticketDetails.enterResolutionNote': 'कृपया एक समाधान नोट दर्ज करें या "नोट के बिना समाधान करें" का उपयोग करें',
        'ticketDetails.commentAdded': 'कमेंट सफलतापूर्वक जोड़ा गया',
        'ticketDetails.commentFailed': 'कमेंट जोड़ने में विफल',
        'ticketDetails.unableToAddComment': 'कमेंट जोड़ने में सक्षम नहीं',
        
        // Contact Officer Page
        'contact.title': 'आपका वार्ड अधिकारी',
        'contact.loading': 'वार्ड अधिकारी की जानकारी लोड हो रही है...',
        'contact.noAssigned': 'आपके क्षेत्र में अभी तक कोई वार्ड अधिकारी नियुक्त नहीं है।',
        'contact.contactOffice': 'सहायता के लिए कृपया नगर निगम कार्यालय से संपर्क करें।',
        'contact.ward': 'वार्ड नंबर',
        'contact.phone': 'फोन',
        'contact.email': 'ईमेल',
        'contact.note': 'नोट',
        'contact.noteText': 'आपका वार्ड अधिकारी आपके क्षेत्र में शिकायतों और समस्याओं को हल करने में मदद के लिए यहाँ है। आपकी शिकायतों पर सहायता या अपडेट के लिए बेझिझक संपर्क करें।',
        'contact.callNow': 'अभी कॉल करें',
        'contact.sendEmail': 'ईमेल भेजें',
        'contact.viewComplaints': 'मेरी शिकायतें देखें',
        'contact.leaderDesignation': 'वार्ड अधिकारी',
        'contact.loadError': 'नेता की जानकारी लोड करने में विफल:',
        'contact.notAuthorized': 'यह पृष्ठ केवल नागरिकों के लिए है',
        'contact.userNotFound': 'उपयोगकर्ता की जानकारी नहीं मिली',
        'contact.leaderNotFound': 'उपयोगकर्ता की जानकारी लोड करने में विफल',
        
        // Profile Page
        'profile.title': 'प्रोफाइल',
        'profile.name': 'नाम',
        'profile.phone': 'फोन',
        'profile.email': 'ईमेल',
        'profile.address': 'पता',
        'profile.ward': 'वार्ड नंबर',
        'profile.designation': 'पदनाम',
        'profile.readOnly': 'केवल पढ़ने के लिए',
        'profile.save': 'सहेजें',
        'profile.cancel': 'रद्द करें',
        'profile.changing': 'यह बदलने के लिए OTP सत्यापन की आवश्यकता होगी',
        'profile.help': 'अपनी प्रोफाइल को कैसे अपडेट करें',
        'profile.helpText1': 'किसी भी फ़ील्ड को संपादित करने के लिए उसके आगे ✏️ आइकन पर क्लिक करें',
        'profile.helpText2': 'फोन और ईमेल परिवर्तन के लिए सुरक्षा के लिए OTP सत्यापन आवश्यक है',
        'profile.helpText3': 'अन्य फ़ील्ड तुरंत अपडेट किए जा सकते हैं',
        'profile.helpText4': 'वार्ड नंबर नहीं बदला जा सकता (प्रशासक द्वारा असाइन किया गया)',
        'profile.updated': 'सफलतापूर्वक अपडेट किया गया',
        'profile.failed': 'अपडेट करने में विफल',
        
        // Create Ticket Page
        'createTicket.title': 'नई शिकायत बनाएं',
        'createTicket.subtitle': 'अपने क्षेत्र में समस्या की रिपोर्ट करें',
        'createTicket.typeLabel': 'शिकायत प्रकार',
        'createTicket.typeComplaint': 'शिकायत',
        'createTicket.typeRequest': 'सेवा अनुरोध',
        'createTicket.typeSuggestion': 'सुझाव',
        'createTicket.titleLabel': 'शीर्षक',
        'createTicket.titlePlaceholder': 'समस्या का संक्षिप्त विवरण',
        'createTicket.description': 'विवरण',
        'createTicket.descriptionPlaceholder': 'समस्या के बारे में अधिक विवरण प्रदान करें',
        'createTicket.category': 'श्रेणी',
        'createTicket.categoryPlaceholder': 'श्रेणी चुनें',
        'createTicket.categoryStreetLights': '🔦 स्ट्रीट लाइटें',
        'createTicket.categoryRoads': '🛣️ सड़कें और गड्ढे',
        'createTicket.categoryWater': '💧 जल आपूर्ति',
        'createTicket.categoryGarbage': '🗑️ कचरा संग्रह',
        'createTicket.categorySewage': '🚰 सीवेज और ड्रेनेज',
        'createTicket.categoryParks': '🌳 पार्क और बाग',
        'createTicket.categoryOthers': '📋 अन्य',
        'createTicket.type': 'प्रकार',
        'createTicket.images': 'फोटो अपलोड करें (वैकल्पिक)',
        'createTicket.imagesHint': 'आप 5 तक छवियां चुन सकते हैं (प्रत्येक अधिकतम 10MB)',
        'createTicket.uploadPrompt': 'फोटो अपलोड करने के लिए क्लिक करें',
        'createTicket.fileFormat': 'JPEG, PNG, GIF (प्रत्येक अधिकतम 10MB)',
        'createTicket.selectImages': 'आप कई छवियां चुन सकते हैं',
        'createTicket.submit': 'शिकायत प्रस्तुत करें',
        'createTicket.submitting': 'प्रस्तुत किया जा रहा है...',
        'createTicket.cancel': 'रद्द करें',
        'createTicket.required': 'आवश्यक फ़ील्ड',
        'createTicket.fileTooLarge': 'बहुत बड़ी है। अधिकतम 10MB।',
        'createTicket.invalidFormat': 'समर्थित इमेज फॉर्मेट नहीं है।',
        'createTicket.uploadSuccess': 'सफलतापूर्वक अपलोड किया गया',
        'createTicket.uploadFailed': 'अपलोड करने में विफल',
        'createTicket.userNotFound': 'उपयोगकर्ता की जानकारी नहीं मिली',
        'createTicket.submitSuccess': 'शिकायत सफलतापूर्वक प्रस्तुत की गई!',
        'createTicket.submitFailed': 'शिकायत प्रस्तुत करने में विफल',
        
        // Dashboard
        'dashboard.title': 'डैशबोर्ड',
        'dashboard.leaderProfile': 'वार्ड अधिकारी की प्रोफाइल',
        'dashboard.serving': 'समर्पण के साथ सेवा करना, कल को बेहतर बनाना',
        'dashboard.vision': 'हमारा मिशन और दृष्टिकोण',
        'dashboard.visionText': 'हम सभी निवासियों के लिए एक स्वच्छ, सुरक्षित और अधिक समृद्ध समुदाय बनाने के लिए प्रतिबद्ध हैं। पारदर्शी शासन, तीव्र समस्या समाधान और निरंतर बुनियादी ढांचे के विकास के माध्यम से, हम अपने वार्ड को रहने, काम करने और बढ़ने के लिए सर्वश्रेष्ठ स्थान बनाने का लक्ष्य रखते हैं। आपकी आवाज महत्वपूर्ण है, आपकी चिंताएं हमारी प्राथमिकता है, और एक साथ हम एक उज्ज्वल भविष्य बनाते हैं।',
        'dashboard.news': 'समाचार और घोषणाएं',
        'dashboard.newsFrom': 'आपके वार्ड अधिकारी से नवीनतम समाचार और अपडेट',
        'dashboard.myUpdates': 'मेरे अपडेट और घोषणाएं',
        'dashboard.noNews': 'अभी तक कोई समाचार या घोषणा नहीं है।',
        'dashboard.addNews': 'समाचार जोड़ें',
        'dashboard.onlyForOfficers': 'केवल वार्ड अधिकारी समाचार जोड़ सकते हैं',
        'dashboard.allNews': 'समाचार सफलतापूर्वक प्राप्त किए गए',
        
        // Alerts & Messages
        'alert.error': 'त्रुटि',
        'alert.success': 'सफलता',
        'alert.loading': 'लोड हो रहा है...',
        'alert.failed': 'लोड करने में विफल',
        'alert.tryAgain': 'कृपया फिर से प्रयास करें',
        'alert.notFound': 'नहीं मिला',
        'alert.fieldRequired': 'आवश्यक है',
        'alert.fieldEmpty': 'खाली नहीं हो सकता',
        'alert.invalidEmail': 'अमान्य ईमेल',
        
        // Status values
        'status.open': 'खुली',
        'status.pending': 'प्रतीक्षा में',
        'status.inProgress': 'प्रक्रिया में',
        'status.resolved': 'हल की गई',
        'status.closed': 'बंद किया गया',
        
        // Profile Page (Fields & Labels)
        'profile.personalInfo': 'व्यक्तिगत जानकारी',
        'profile.fieldName': 'नाम',
        'profile.fieldPhone': 'फोन',
        'profile.fieldEmail': 'ईमेल',
        'profile.fieldAddress': 'पता',
        'profile.fieldWardNumber': 'वार्ड नंबर',
        'profile.fieldDesignation': 'पदनाम',
        'profile.fieldJurisdiction': 'वार्ड नंबर',
        'profile.readOnlyBadge': 'केवल पढ़ें',
        'profile.editButton': 'संपादित करें',
        'profile.saveButton': 'सहेजें',
        'profile.cancelButton': 'रद्द करें',
        'profile.verifyOTPModal': 'फोन/ईमेल परिवर्तन सत्यापित करें',
        'profile.sendOTPButton': 'OTP भेजें',
        'profile.verifyButton': 'सत्यापित करें & अपडेट करें',
        'profile.resendOTPButton': 'OTP फिर से भेजें',
        'profile.closeButton': 'बंद करें',
        'profile.notSet': 'निर्धारित नहीं',
        'profile.changeWarning': 'इसे बदलने के लिए OTP सत्यापन की आवश्यकता होगी',
        'profile.updateSuccess': 'सफलतापूर्वक अपडेट किया गया',
        'profile.updateFailed': 'अपडेट करने में विफल',
        'profile.emptyFieldError': 'खाली नहीं हो सकता',
        'profile.sentOTP': 'OTP भेजा गया',
        'profile.otpSendFailed': 'OTP भेजने में विफल',
        'profile.invalidOTP': 'कृपया 6-अंकीय OTP दर्ज करें',
        'profile.otpVerifiedSuccess': 'OTP सफलतापूर्वक सत्यापित',
        'profile.loadProfileFailed': 'प्रोफाइल लोड करने में विफल',
        'profile.fileSizeTooLarge': 'फाइल आकार 5MB से कम होना चाहिए',
        'profile.invalidFileType': 'केवल JPEG और PNG छवियां अनुमत हैं',
        'profile.notLoggedIn': 'आप लॉगिन नहीं हैं। कृपया फिर से लॉगिन करें।',
        'profile.sessionExpired': 'आपका सत्र समाप्त हो गया है। कृपया फिर से लॉगिन करें।',
        'profile.profilePictureUpdated': 'प्रोफाइल चित्र सफलतापूर्वक अपडेट किया गया',
        'profile.uploadFailed': 'प्रोफाइल चित्र अपलोड करने में विफल',
        
        // Auth & Login Page
        'auth.title': 'लॉगिन या पंजीकरण',
        'auth.phoneStep': 'अपना फोन नंबर दर्ज करें',
        'auth.phoneLabel': 'फोन नंबर',
        'auth.phonePlaceholder': '10 अंकों का मोबाइल नंबर दर्ज करें',
        'auth.phoneHint': 'हम आपको सत्यापित करने के लिए एक OTP भेजेंगे',
        'auth.roleLabel': 'मैं हूँ',
        'auth.roleCitizen': 'नागरिक',
        'auth.roleLeader': 'वार्ड अधिकारी',
        'auth.sendOTPButton': 'OTP भेजें',
        'auth.otpStep': 'OTP दर्ज करें',
        'auth.otpSentTo': 'OTP भेजा गया',
        'auth.otpLabel': 'OTP कोड',
        'auth.otpPlaceholder': '6 अंकीय OTP दर्ज करें',
        'auth.otpValid': '5 मिनट के लिए वैध',
        'auth.verifyOTPButton': 'OTP सत्यापित करें',
        'auth.backButton': 'वापस',
        'auth.registerStep': 'पंजीकरण पूरा करें',
        'auth.fullNameLabel': 'पूरा नाम',
        'auth.fullNamePlaceholder': 'अपना पूरा नाम दर्ज करें',
        'auth.emailLabel': 'ईमेल',
        'auth.emailPlaceholder': 'अपना ईमेल दर्ज करें',
        'auth.addressLabel': 'पता',
        'auth.addressPlaceholder': 'अपना पूरा पता दर्ज करें',
        'auth.wardNumberLabel': 'वार्ड नंबर',
        'auth.wardNumberPlaceholder': 'उदा., 15',
        'auth.wardOfficerLabel': 'वार्ड अधिकारी',
        'auth.wardOfficerSelect': 'चुनें...',
        'auth.registerButton': 'पंजीकरण पूरा करें',
        'auth.backToHome': 'होम पर वापस जाएं',
        'auth.requiredField': 'आवश्यक क्षेत्र',
        
        // Home/Index Page
        'home.title': 'नगर निगम',
        'home.subtitle': 'शिकायत प्रबंधन प्रणाली',
        'home.tagline': 'आपकी आवाज़, हमारी जिम्मेदारी',
        'home.getStarted': 'शुरू करें',
        'home.learnMore': 'और जानें',
        'home.featureEasyRegistration': 'आसान पंजीकरण',
        'home.featureEasyRegDesc': 'मोबाइल OTP प्रमाणीकरण का उपयोग करके पंजीकरण करें। तेज़ और सुरक्षित।',
        'home.featureFileComplaints': 'शिकायतें दर्ज करें',
        'home.featureFileCompDesc': 'सड़क की रोशनी, सड़कों, जल आपूर्ति आदि जैसी समस्याओं की रिपोर्ट करें।',
        'home.featureUploadPhotos': 'फोटो अपलोड करें',
        'home.featureUploadPhotosDesc': 'तेजी से समाधान के लिए अपनी शिकायतों में फोटो साक्ष्य जोड़ें।',
        'home.featureTrackStatus': 'स्थिति ट्रैक करें',
        'home.featureTrackStatusDesc': 'आपकी शिकायत की स्थिति और समाधान पर वास्तविक समय में अपडेट।',
        'home.featureCommunication': 'संचार',
        'home.featureCommunicationDesc': 'वार्ड अधिकारियों के साथ चैट करें और अपनी शिकायतों पर अपडेट प्राप्त करें।',
        'home.featureFastResolution': 'तीव्र समाधान',
        'home.featureFastResDesc': 'तेजी से कार्रवाई के लिए वार्ड अधिकारियों को प्रत्यक्ष असाइनमेंट।',
        'home.statsResolved': 'हल की गई शिकायतें',
        'home.statsOfficers': 'वार्ड अधिकारी',
        'home.statsAvailable': 'सेवा उपलब्ध',
        'home.statsSatisfaction': 'संतुष्टि दर',
        'home.ctaTitle': 'फर्क लाने के लिए तैयार हैं?',
        'home.ctaSubtitle': 'हजारों नागरिकों के साथ अपने शहर को बेहतर बनाने में शामिल हों',
        'home.ctaButton': 'अभी पंजीकरण करें',
        'home.footerCopyright': '© 2026 नगर निगम। सर्वाधिकार सुरक्षित।',
        'home.footerEmergency': 'आपातकाल के लिए, कॉल करें: 100 | ईमेल: support@municipal.gov',
        
        // Personal Information / Profile
        'common.personalInfo': 'व्यक्तिगत जानकारी',
        'common.recentComplaints': 'हाल की शिकायतें',
        'common.howToEdit': 'अपनी प्रोफाइल को कैसे अपडेट करें',
        'common.note': 'नोट',
        'common.submit': 'प्रस्तुत करें',
        'common.cancel': 'रद्द करें',
        'common.save': 'परिवर्तन सहेजें',
        'common.publishNews': 'समाचार प्रकाशित करें',
        
        // Contact Officer Page
        'contact.leaderInfo': 'वार्ड अधिकारी की जानकारी',
        'contact.leaderNote': 'आपका वार्ड अधिकारी आपके क्षेत्र में शिकायतों और समस्याओं को हल करने में मदद के लिए यहाँ है। आपकी शिकायतों पर सहायता या अपडेट के लिए बेझिझक संपर्क करें।'
    }
};

// Language Management
const LANG_KEY = 'municipal_lang';

function getLanguage() {
    return localStorage.getItem(LANG_KEY) || 'en';
}

function setLanguage(lang) {
    localStorage.setItem(LANG_KEY, lang);
    // Apply translations immediately without reload
    applyPageTranslations();
    
    // If we're on the my-tickets page, re-setup and reload the tickets
    if (typeof setupTicketsPage === 'function') {
        try {
            setupTicketsPage();
        } catch (e) {
            console.error('Error in setupTicketsPage:', e);
        }
    }
    
    if (typeof loadTickets === 'function') {
        try {
            loadTickets();
        } catch (e) {
            console.error('Error in loadTickets:', e);
        }
    }
    
    // If we're on the ticket-details page, reload the ticket to apply language
    if (typeof loadTicketDetails === 'function') {
        try {
            loadTicketDetails();
        } catch (e) {
            console.error('Error in loadTicketDetails:', e);
        }
    }
    
    // If we're on the dashboard page, reload news to apply language
    if (typeof loadNews === 'function') {
        try {
            loadNews();
        } catch (e) {
            console.error('Error in loadNews:', e);
        }
    }
    
    // Update dashboard news translations (title and empty state)
    if (typeof updateDashboardNewsTranslations === 'function') {
        try {
            updateDashboardNewsTranslations();
        } catch (e) {
            console.error('Error in updateDashboardNewsTranslations:', e);
        }
    }
    
    // If we're on the profile page, reload profile to apply language to field labels
    if (typeof loadProfile === 'function') {
        try {
            loadProfile();
        } catch (e) {
            console.error('Error in loadProfile:', e);
        }
    }
    
    // If we're on the create-ticket page, apply translations to form
    if (typeof updateCreateTicketTranslations === 'function') {
        try {
            updateCreateTicketTranslations();
        } catch (e) {
            console.error('Error in updateCreateTicketTranslations:', e);
        }
    }
    
    // If we're on the contact-leader page, reload page data
    if (typeof loadContactPage === 'function') {
        try {
            loadContactPage();
        } catch (e) {
            console.error('Error in loadContactPage:', e);
        }
    }
}

function t(key) {
    const lang = getLanguage();
    return translations[lang]?.[key] || translations['en']?.[key] || key;
}

// Helper function to convert underscore-separated status to camelCase for translation
function getStatusTranslation(status) {
    if (!status) return status;
    // Convert IN_PROGRESS to inProgress, OPEN to open, etc.
    const camelCaseStatus = status
        .toLowerCase()
        .split('_')
        .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    return t('status.' + camelCaseStatus);
}

// Apply translations to all elements with data-i18n attributes
function applyPageTranslations() {
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // Translate titles and aria-labels
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });
}

// Initialize language system on page load
function initializeLanguageSystem() {
    // Add CSS for language toggle if not already present
    if (!document.getElementById('langToggleStyles')) {
        const style = document.createElement('style');
        style.id = 'langToggleStyles';
        style.textContent = `
            #languageToggle, #languageToggleTop {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
            }
            #langSelect {
                padding: 8px 12px !important;
                border: 2px solid rgba(255,255,255,0.4) !important;
                border-radius: 4px !important;
                background-color: rgba(255,255,255,0.15) !important;
                color: white !important;
                font-size: 0.95em !important;
                cursor: pointer !important;
                font-family: inherit !important;
                font-weight: 500 !important;
                min-width: 100px !important;
                transition: all 0.3s ease !important;
            }
            #langSelect:hover {
                background-color: rgba(255,255,255,0.25) !important;
                border-color: rgba(255,255,255,0.6) !important;
            }
            #langSelect option {
                color: #333 !important;
                background-color: white !important;
                padding: 4px 8px !important;
            }
            @media (max-width: 600px) {
                #langSelect {
                    padding: 6px 10px !important;
                    font-size: 0.85em !important;
                    min-width: 90px !important;
                }
            }
            @media (max-width: 480px) {
                #langSelect {
                    padding: 5px 8px !important;
                    font-size: 0.75em !important;
                    min-width: 75px !important;
                }
                #languageToggle, #languageToggleTop {
                    gap: 4px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    const currentLang = getLanguage();
    
    // Try to find an existing language toggle container (home or login pages)
    let toggleContainer = document.getElementById('languageToggle') || document.getElementById('languageToggleTop');
    
    if (toggleContainer) {
        // Check if toggle already exists
        if (document.getElementById('langSelect')) return;
        
        // Create select element
        const select = document.createElement('select');
        select.id = 'langSelect';
        
        // Create English option
        const enOption = document.createElement('option');
        enOption.value = 'en';
        enOption.textContent = 'English';
        if (currentLang === 'en') enOption.selected = true;
        select.appendChild(enOption);
        
        // Create Hindi option
        const hiOption = document.createElement('option');
        hiOption.value = 'hi';
        hiOption.textContent = 'हिंदी';
        if (currentLang === 'hi') hiOption.selected = true;
        select.appendChild(hiOption);
        
        // Add event listener
        select.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
        
        // Add to container
        toggleContainer.appendChild(select);
    } else {
        // Fallback: look for nav-menu (on dashboard pages)
        const navbar = document.querySelector('.nav-menu');
        if (navbar) {
            // Check if toggle already exists
            if (document.getElementById('languageToggle')) return;
            
            const languageToggle = document.createElement('div');
            languageToggle.id = 'languageToggle';
            
            const select = document.createElement('select');
            select.id = 'langSelect';
            
            const enOption = document.createElement('option');
            enOption.value = 'en';
            enOption.textContent = 'English';
            if (currentLang === 'en') enOption.selected = true;
            select.appendChild(enOption);
            
            const hiOption = document.createElement('option');
            hiOption.value = 'hi';
            hiOption.textContent = 'हिंदी';
            if (currentLang === 'hi') hiOption.selected = true;
            select.appendChild(hiOption);
            
            select.addEventListener('change', (e) => {
                setLanguage(e.target.value);
            });
            
            languageToggle.appendChild(select);
            navbar.insertBefore(languageToggle, navbar.firstChild);
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguageSystem();
    applyPageTranslations();
});
