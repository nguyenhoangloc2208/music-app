import { atomWithStorage } from "jotai/utils";
import { storage } from "../utils/storage";
import { YoutubePlayListInfo } from "../services/fetchPlayList";

const youtubePlayListInfos: YoutubePlayListInfo[] = [
    {
        id: "PLcgGO4jEkbjiyeMa9SzmzGEywC7Yq_Flm",
        snippet: {
            title: "Chill Music - Beru",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/OZYYZi0Hoo4/hqdefault.jpg",
                },
            }
        },
    },
    {
        id: "RDk9OmMY9sP9o",
        snippet: {
            title: "Mix - Thắng - Hướng Dương [Official Audio]",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/k9OmMY9sP9o/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDGMEMCMFH2exzjBeE_zAHHJOdxgVMlvUfAMvaeto",
        snippet: {
            title: "Mix - Music of Asia",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/lvUfAMvaeto/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDepYvxORKcLg",
        snippet: {
            title: "Mix - Đơn Giản | Low G | Nhà Hóa Học Đống Đa",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/epYvxORKcLg/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDjn8NhISy9rg",
        snippet: {
            title: "Mix - Datmaniac - Thiên Hà Trước Hiên Nhà (Prod. by Mikeezy) ft. Chú 3 (Official MV)",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/jn8NhISy9rg/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RD2sBKRU9Ih-U",
        snippet: {
            title: "Mix - 王OK | a few minutes of some music✨",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/2sBKRU9Ih-U/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RD0-p5EbAsxUM",
        snippet: {
            title: "Mix - Rihanna - Diamonds",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/0-p5EbAsxUM/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDCPkGTSW34_I",
        snippet: {
            title: "Mix - Đen - Cô Gái Bàn Bên ft. Lynk Lee (w/lyrics)",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/CPkGTSW34_I/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDO5yYIn0mlt0",
        snippet: {
            title: "Mix - 【歌手·单曲纯享】鬼马精灵#Faouzia《#Crazy》海妖般高音令人疯狂 动感改编诠释独特风格 #OneTake | Singer 2024 EP1 | MangoTV",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/O5yYIn0mlt0/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDBU6e-l7ZZj0",
        snippet: {
            title: "Mix - HUYẾT NGUYỆT (CM1X REMIX) | ALICE & ROKI",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/BU6e-l7ZZj0/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDHQqOo_b-5Xs",
        snippet: {
            title: "Mix - BTS (방탄소년단) - TRIVIA 承: LOVE [8D USE HEADPHONE] 🎧",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/HQqOo_b-5Xs/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDMMkEZa5Bn3IaM",
        snippet: {
            title: "My Mix",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/kEZa5Bn3IaM/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDBc8A9Un-eTs",
        snippet: {
            title: "Mix - CẨM TÚ CẦU - RAYO x HUỲNH VĂN (Prod. LeNham) | LYRIC VIDEO",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/Bc8A9Un-eTs/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDdD-cJCF5BRk",
        snippet: {
            title: "Mix - Táo - Tương Tư (Official MV)",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/dD-cJCF5BRk/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDUUHwbFuvkaE",
        snippet: {
            title: "Mix - 𝘀hut up and listen - speed up",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/UUHwbFuvkaE/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDqzSJgTSbvUc",
        snippet: {
            title: "Mix - Gnarls Barkley-Crazy (Sub español-Lyrics)(Español/Inglés)",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/qzSJgTSbvUc/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDPIf9GvWaxQQ",
        snippet: {
            title: "Mix - Clean Bandit - Symphony (Lyrics) feat. Zara Larsson",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/PIf9GvWaxQQ/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDIPdRiYPOvj0",
        snippet: {
            title: "Mix - Tiếp Đất (prod. Vantacrow) | Low G ft. Thắng | Rap Nhà Làm",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/IPdRiYPOvj0/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "RDkSjj0LlsqnI",
        snippet: {
            title: "Mix - Ngot - LAN CUOI (di ben em xot xa nguoi oi)",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/kSjj0LlsqnI/hqdefault.jpg",
                },
            },
        }
    },
    {
        id: "PLgJHC0Q8y9LI92tD0SXnevs8IbbwC_Z_I",
        snippet: {
            title: "Music Spacer",
            thumbnails: {
                high: {
                    url: "https://i.ytimg.com/vi/SeWt7IpZ0CA/hqdefault.jpg",
                },
            },
        }
    }
]


export const YoutubePlayListInfoAtom = atomWithStorage<YoutubePlayListInfo[]>(
    'youtubePlayListInfo',
    youtubePlayListInfos,
    storage
);