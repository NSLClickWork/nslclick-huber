const dictionary = {
    vi: {
        professions: {
            'pflege': 'Điều dưỡng / Y tá',
            'mechaniker': 'Thợ cơ khí',
            'koch': 'Đầu bếp',
            'hotel': 'Nhà hàng Khách sạn',
            'it': 'Công nghệ thông tin'
        },
        labels: {
            search: 'Tìm kiếm',
            logout: 'Đăng xuất',
            center: 'Trung tâm',
            level: 'Trình độ',
            available: 'Sẵn sàng từ',
            view_profile: 'Xem hồ sơ',
            download_pdf: 'Tải Setcard (PDF)',
            view_video: 'Bấm vào để xem video',
            date_of_birth: 'Ngày sinh',
            profession: 'Nghề',
            birth_year: 'Năm sinh',
            deutsch_level: 'Tiếng Đức',
            nsl_result: 'Kết quả NSL',
            integration_level: 'Cấp độ hội nhập',
            availability: 'Thời gian sẵn sàng',
            superpowers: 'THẾ MẠNH NỔI BẬT',
            disclaimer: 'Điểm NSL-Score dựa trên một loạt các bài đánh giá toàn diện để đánh giá IQ, ra quyết định và nhiều kỹ năng khác, với điểm chuẩn trung bình là 48.'
        }
    },
    en: {
        professions: {
            'pflege': 'Nurse / Caregiver',
            'mechaniker': 'Mechanic',
            'koch': 'Chef / Cook',
            'hotel': 'Hospitality',
            'it': 'IT Specialist'
        },
        labels: {
            search: 'Search',
            logout: 'Logout',
            center: 'Center',
            level: 'Level',
            available: 'Available from',
            view_profile: 'View Profile',
            download_pdf: 'Download Setcard (PDF)',
            view_video: 'Click to watch the video',
            date_of_birth: 'Date of Birth',
            profession: 'Profession',
            birth_year: 'Year of Birth',
            deutsch_level: 'German',
            nsl_result: 'NSL-Result',
            integration_level: 'Leistungs- Integrationslevel',
            availability: 'Availability',
            superpowers: 'SUPERPOWERS',
            disclaimer: 'The NSL-Score is based on a series of comprehensive assessments to evaluate IQ, decision-making, and various other skills, achieving an average benchmark score of 48.'
        }
    },
    de: {
        professions: {
            'pflege': 'Pflegefachkraft',
            'mechaniker': 'Mechaniker/in',
            'koch': 'Koch/Köchin',
            'hotel': 'Hotelfachmann/-frau',
            'it': 'IT-Fachkraft'
        },
        labels: {
            search: 'Suche',
            logout: 'Abmelden',
            center: 'Zentrum',
            level: 'Niveau',
            available: 'Verfügbar ab',
            view_profile: 'Profil ansehen',
            download_pdf: 'Setcard herunterladen (PDF)',
            view_video: 'Klicken, um das Video anzusehen',
            date_of_birth: 'Geburtsdatum',
            profession: 'Beruf',
            birth_year: 'Geburtsjahr',
            deutsch_level: 'Deutsch',
            nsl_result: 'NSL-Result',
            integration_level: 'Leistungs- Integrationslevel',
            availability: 'Verfügbarkeit',
            superpowers: 'SUPERPOWERS',
            disclaimer: 'Der NSL-Score basiert auf einer Reihe umfassender Beurteilungen zur Bewertung des IQ, der Entscheidungsfindung und verschiedener anderer Fähigkeiten und erreicht einen durchschnittlichen Benchmarkwert von 48.'
        }
    }
};

function i18nMiddleware(req, res, next) {
    // Determine language from query string, session, or default to DE for partners
    let lang = req.query.lang || req.session.lang;
    
    // Default: DE for all pages
    if (!lang) {
        lang = 'de';
    }

    if (!['vi', 'en', 'de'].includes(lang)) {
        lang = 'de';
    }

    req.session.lang = lang;
    res.locals.lang = lang;
    res.locals.__ = (key, type = 'labels') => {
        return dictionary[lang]?.[type]?.[key] || key;
    };

    next();
}

module.exports = i18nMiddleware;
