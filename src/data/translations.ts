import { SupportedLanguage } from '../types/emergency';

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    app_name: 'RESQNET',
    app_tagline: 'Climate Aware Emergency Response Network',
    nav_home: 'SOS & Alert',
    nav_map: 'Live Map',
    nav_hospitals: 'Hospitals',
    nav_reports: 'Roadblocks',
    nav_profile: 'Medical Card',
    
    // SOS
    sos_button_label: 'EMERGENCY SOS',
    sos_tap_hint: 'TAP FOR 1-TOUCH ASSISTANCE',
    sos_countdown_title: 'EMERGENCY DISPATCH INITIATED',
    sos_countdown_desc: 'Hold or wait 5 seconds. Dispatching emergency SMS & WhatsApp with live GPS coordinates to your emergency contacts.',
    sos_cancel_button: 'CANCEL DISPATCH (ACCIDENTAL)',
    sos_dispatch_now: 'SEND DISPATCH NOW',
    sos_siren_start: 'SOUND SEARCH & RESCUE SIREN',
    sos_siren_stop: 'STOP SIREN BEACON',
    call_112_direct: 'DIRECT CALL 112 (NATIONAL POLICE/FIRE/AMBULANCE)',
    quick_sms_templates: 'Quick Situation Dispatch',
    
    // Presets
    preset_flood: 'Flood water rising fast! Need immediate evacuation assistance.',
    preset_medical: 'Severe medical emergency! Need immediate ambulance & doctor.',
    preset_trapped: 'Trapped inside waterlogged location. High risk of building collapse.',
    preset_accident: 'Accident reported on waterlogged road. Medical help required urgently.',
    preset_supplies: 'Out of drinking water & food due to climate disaster.',

    // Climate Risk
    climate_title: 'Climate Hazard Status',
    risk_low: 'LOW CLIMATE RISK',
    risk_medium: 'MODERATE FLOOD RISK',
    risk_high: 'CRITICAL FLOOD ALERT',
    rain_next_24h: 'Next 24h Rainfall',
    rain_next_72h: 'Next 72h Total',
    read_aloud: 'Listen to Audio Alert',
    audio_playing: 'Reading Alert...',

    // Map & Hospitals
    map_title: 'Live Crisis Map',
    filter_all: 'All Markers',
    filter_hospitals: 'Hospitals (24x7)',
    filter_clinics: 'Clinics & PHCs',
    filter_shelters: 'Relief Shelters',
    filter_roadblocks: 'Roadblocks',
    filter_flood_zones: 'Flood Risks',
    nearby_facilities: 'Nearby Healthcare Facilities',
    call_now: 'Call',
    get_directions: 'Route Directions',
    distance_km: 'km away',

    // Roadblocks
    report_hazard: 'Report Blocked Road',
    hazard_title: 'Community Road Availability',
    hazard_flooded: 'Flooded / Waterlogged Road',
    hazard_underpass: 'Submerged Underpass',
    hazard_tree: 'Fallen Tree / Electric Pole',
    hazard_bridge: 'Submerged Bridge',
    hazard_landslide: 'Mudslide / Landslide',
    hazard_gridlock: 'Emergency Gridlock',
    confirm_blockage: 'Still Blocked?',
    confirmed_by_users: 'Verified by commuters',
    submit_report: 'Submit Hazard Pin',

    // Medical Card
    medical_card_title: 'Emergency Medical ID',
    medical_card_note: 'Saved on device only. Paramedics can view without unlocking.',
    blood_group: 'Blood Group',
    allergies: 'Allergies',
    medications: 'Current Medications',
    chronic_conditions: 'Chronic Conditions / Medical Notes',
    emergency_contacts: 'Emergency Contacts (ICE)',
    save_medical_card: 'Save Emergency Medical ID',
    qr_code_title: 'Paramedic Scan QR Code',

    // Offline & Status
    offline_banner: 'OFFLINE MODE: Running on cached helplines & localized emergency registry.',
    location_denied: 'Location permission required for live guidance. Using standard regional center.',
    manual_location: 'Enter Manual City / Pincode',
  },
  hi: {
    app_name: 'रेस्क्यूनेट (RESQNET)',
    app_tagline: 'जलवायु आपातकालीन प्रतिक्रिया नेटवर्क',
    nav_home: 'एसओएस व अलर्ट',
    nav_map: 'लाइव नक्शा',
    nav_hospitals: 'अस्पताल',
    nav_reports: 'सड़क रुकावटें',
    nav_profile: 'मेडिकल कार्ड',
    
    // SOS
    sos_button_label: 'आपातकालीन एसओएस',
    sos_tap_hint: 'तत्काल सहायता हेतु एक बार दबाएं',
    sos_countdown_title: 'आपातकालीन संदेश भेजा जा रहा है',
    sos_countdown_desc: '5 सेकंड प्रतीक्षा करें। आपके लाइव जीपीएस स्थान के साथ एसएमएस और व्हाट्सएप संदेश भेजा जा रहा है।',
    sos_cancel_button: 'रद्द करें (गलती से दबा)',
    sos_dispatch_now: 'तुरंत संदेश भेजें',
    sos_siren_start: 'खोज एवं बचाव सायरन बजाएं',
    sos_siren_stop: 'सायरन बंद करें',
    call_112_direct: 'सीधे 112 पर कॉल करें (पुलिस/अग्निशामक/एम्बुलेंस)',
    quick_sms_templates: 'त्वरित आपात संदेश',

    // Presets
    preset_flood: 'बाढ़ का पानी तेजी से बढ़ रहा है! तत्काल बचाव की आवश्यकता है।',
    preset_medical: 'गंभीर चिकित्सीय आपात स्थिति! तत्काल एम्बुलेंस की आवश्यकता है।',
    preset_trapped: 'जलभराव में फंसे हुए हैं। इमारत गिरने का खतरा है।',
    preset_accident: 'जलभराव वाली सड़क पर दुर्घटना हुई है। तत्काल चिकित्सा सहायता चाहिए।',
    preset_supplies: 'बाढ़ के कारण पीने का पानी और भोजन समाप्त हो गया है।',

    // Climate Risk
    climate_title: 'जलवायु एवं बाढ़ चेतावनी',
    risk_low: 'निम्न जलवायु जोखिम',
    risk_medium: 'मध्यम बाढ़ जोखिम',
    risk_high: 'गंभीर बाढ़ चेतावनी',
    rain_next_24h: 'अगले 24 घंटे की बारिश',
    rain_next_72h: 'अगले 72 घंटे की बारिश',
    read_aloud: 'चेतावनी ऑडियो सुनें',
    audio_playing: 'चेतावनी पढ़ी जा रही है...',

    // Map & Hospitals
    map_title: 'लाइव आपदा नक्शा',
    filter_all: 'सभी पिन',
    filter_hospitals: 'अस्पताल (24x7)',
    filter_clinics: 'क्लिनिक व स्वास्थ्य केंद्र',
    filter_shelters: 'राहत शिविर',
    filter_roadblocks: 'बंद सड़कें',
    filter_flood_zones: 'बाढ़ क्षेत्र',
    nearby_facilities: 'निकटतम स्वास्थ्य केंद्र',
    call_now: 'कॉल करें',
    get_directions: 'मार्ग दिशा-निर्देश',
    distance_km: 'किमी दूर',

    // Roadblocks
    report_hazard: 'सड़क अवरोध की सूचना दें',
    hazard_title: 'सड़क उपलब्धता स्थिति',
    hazard_flooded: 'जलमग्न / बाढ़ग्रस्त सड़क',
    hazard_underpass: 'डूबा हुआ अंडरपास',
    hazard_tree: 'गिरा हुआ पेड़ / बिजली का खंभा',
    hazard_bridge: 'डूबा हुआ पुल',
    hazard_landslide: 'भूस्खलन',
    hazard_gridlock: 'आपातकालीन जाम',
    confirm_blockage: 'क्या अभी भी बंद है?',
    confirmed_by_users: 'नागरिकों द्वारा सत्यापित',
    submit_report: 'सड़क अवरोध दर्ज करें',

    // Medical Card
    medical_card_title: 'आपातकालीन मेडिकल आईडी',
    medical_card_note: 'केवल आपके फोन में सुरक्षित है। बचावकर्मी बिना फोन खोले देख सकते हैं।',
    blood_group: 'रक्त समूह (Blood Group)',
    allergies: 'एलर्जी (Allergies)',
    medications: 'वर्तमान दवाएं',
    chronic_conditions: 'चिकित्सीय विवरण',
    emergency_contacts: 'आपातकालीन संपर्क (ICE)',
    save_medical_card: 'मेडिकल कार्ड सुरक्षित करें',
    qr_code_title: 'बचावकर्मी हेतु क्यूआर कोड',

    // Offline & Status
    offline_banner: 'ऑफलाइन मोड: कैश्ड हेल्पलाइन और स्थानीय अस्पताल डेटा सक्रिय है।',
    location_denied: 'लाइव मार्ग हेतु स्थान अनुमति आवश्यक है। क्षेत्रीय केंद्र उपयोग में है।',
    manual_location: 'शहर / पिनकोड दर्ज करें',
  },
  mr: {
    app_name: 'रेस्क्यूनेट (RESQNET)',
    app_tagline: 'हवामान आपत्कालीन प्रतिसाद नेटवर्क',
    nav_home: 'एसओएस व सतर्कता',
    nav_map: 'थेट नकाशा',
    nav_hospitals: 'रुग्णालये',
    nav_reports: 'रस्ता अडथळे',
    nav_profile: 'वैद्यकीय कार्ड',
    
    // SOS
    sos_button_label: 'आपत्कालीन एसओएस',
    sos_tap_hint: 'तातडीच्या मदतीसाठी एकदा स्पर्श करा',
    sos_countdown_title: 'आपत्कालीन मदत संदेश पाठवला जात आहे',
    sos_countdown_desc: '५ सेकंद थांबा. आपल्या थेट जीपीएस स्थानासह आपत्कालीन संपर्कांना एसएमएस व व्हॉट्सॲप संदेश जात आहे.',
    sos_cancel_button: 'रद्द करा (चुकीने दाबले गेले)',
    sos_dispatch_now: 'ताबडतोब संदेश पाठवा',
    sos_siren_start: 'शोध व बचाव सायरन वाजवा',
    sos_siren_stop: 'सायरन बंद करा',
    call_112_direct: 'थेट ११२ डायल करा (पोलीस/अग्निशामक/रुग्णवाहिका)',
    quick_sms_templates: 'तातडीचे संदेश साचे',

    // Presets
    preset_flood: 'पुराचे पाणी वेगाने वाढत आहे! तातडीने सुरक्षित स्थलांतर आवश्यक आहे.',
    preset_medical: 'गंभीर वैद्यकीय आणीबाणी! रुग्णवाहिकेची तातडीने गरज आहे.',
    preset_trapped: 'पाण्यात अडकलेलो आहोत. इमारत कोसळण्याचा धोका आहे.',
    preset_accident: 'पाणी साचलेल्या रस्त्यावर अपघात झाला आहे. वैद्यकीय मदत हवी आहे.',
    preset_supplies: 'पुरामुळे पिण्याचे पाणी व अन्न संपले आहे.',

    // Climate Risk
    climate_title: 'हवामान व पूर धोका स्थिती',
    risk_low: 'कमी हवामान धोका',
    risk_medium: 'मध्यम पूर धोका',
    risk_high: 'अतिदक्षता पूर इशारा',
    rain_next_24h: 'पुढील २४ तासांतील पाऊस',
    rain_next_72h: 'पुढील ७२ तासांतील एकूण पाऊस',
    read_aloud: 'इशारा ऑडिओ ऐका',
    audio_playing: 'इशारा वाचला जात आहे...',

    // Map & Hospitals
    map_title: 'थेट आपत्ती नकाशा',
    filter_all: 'सर्व नोंदी',
    filter_hospitals: 'रुग्णालये (२४x७)',
    filter_clinics: 'दवाखाने व प्राथमिक केंद्र',
    filter_shelters: 'निवारा केंद्र',
    filter_roadblocks: 'बंद रस्ते',
    filter_flood_zones: 'पूर प्रवण क्षेत्र',
    nearby_facilities: 'जवळची आरोग्य केंद्रे',
    call_now: 'कॉल करा',
    get_directions: 'मार्ग दिशा-निर्देश',
    distance_km: 'किमी अंतरावर',

    // Roadblocks
    report_hazard: 'रस्ता अडथळा नोंदवा',
    hazard_title: 'रस्ता उपलब्धता स्थिती',
    hazard_flooded: 'पाण्याखाली गेलेला रस्ता',
    hazard_underpass: 'बुडालेला भुयारी मार्ग',
    hazard_tree: 'झाड / विजेचा खांब पडला',
    hazard_bridge: 'पाण्याखाली गेलेला पूल',
    hazard_landslide: 'दरड कोसळली',
    hazard_gridlock: 'वाहतूक कोंडी',
    confirm_blockage: 'रस्ता अजूनही बंद आहे का?',
    confirmed_by_users: 'नागरिकांकडून खात्री',
    submit_report: 'अडथळा नोंदवा',

    // Medical Card
    medical_card_title: 'आपत्कालीन वैद्यकीय ओळखपत्र',
    medical_card_note: 'फक्त फोनमध्ये सुरक्षित साठवले जाते. बचाव कर्मचारी फोन अनलॉक न करता पाहू शकतात.',
    blood_group: 'रक्तगट (Blood Group)',
    allergies: 'ॲलर्जी (Allergies)',
    medications: 'सध्याची औषधे',
    chronic_conditions: 'वैद्यकीय नोंदी',
    emergency_contacts: 'आपत्कालीन संपर्क (ICE)',
    save_medical_card: 'वैद्यकीय कार्ड जतन करा',
    qr_code_title: 'बचाव कर्मचाऱ्यांसाठी क्यूआर कोड',

    // Offline & Status
    offline_banner: 'ऑफलाइन मोड: साठवलेल्या हेल्पलाईन व स्थानिक रुग्णालय माहितीवर कार्यरत.',
    location_denied: 'थेट मार्गदर्शनासाठी स्थान परवानगी आवश्यक. विभागीय केंद्र वापरले आहे.',
    manual_location: 'शहर / पिनकोड टाका',
  },
};
