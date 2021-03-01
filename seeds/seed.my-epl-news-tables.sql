BEGIN;

TRUNCATE 
users_articles,
articles,
users
RESTART IDENTITY CASCADE;

INSERT INTO users (username, name, team, password)
VALUES 
    ('demo_user', 'Demo User',  'LEE', '$2a$12$fSEDq3CahsF/w9MsEcvcneP7JboY9ayklOOzYFnhGvZkMaBAWoWq2'),
    ('admin', 'Jake',  'EVE', '$2a$12$fSEDq3CahsF/w9MsEcvcneP7JboY9ayklOOzYFnhGvZkMaBAWoWq2');


INSERT INTO articles (team, source, author, title, description, article_url, image_url, published_at, content)
    VALUES
    ('EVE', 'Independent', 'Callum Rice-Coates', 'Everton vs Southampton LIVE: Team news, line-ups and more ahead of Premier League fixture tonight', 'Follow all the action live from Goodison Park', 'https://www.independent.co.uk/sport/football/live/everton-southampton-live-stream-score-updates-b1809444.html', 'https://static.independent.co.uk/2021/03/01/15/newFile-3.jpg?width=1200&auto=webp&quality=75', '2021-03-01T18:32:42Z', 'Follow all the action as Everton welcome Southampton to Goodison Park in the Premier League this evening. \r\nBoth sides enjoyed fantastic starts to their seasons, vying for position at the very top of… [+1555 chars]'),
    ('EVE', 'SB Nation', 'Ian Decker', 'FA WSL Recap: Everton 3–2 Tottenham | Toffees display character in momentous away game', 'Sunday’s victory versus Spurs brings end to difficult stretch of fixtures', 'https://royalbluemersey.sbnation.com/2021/3/1/22306355/fa-wsl-recap-everton-women-3-2-tottenham-recap-toffees-display-character-in-momentous-away-game', 'https://cdn.vox-cdn.com/thumbor/BXk2xzRLfbQ_fuXLJ9sLJ6stYeA=/0x22:2927x1554/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/22335403/1304548387.jpg', '2021-03-01T10:00:00Z',  'Jill Scott, center-bottom, scored her first goal of the season for the Toffees in Sunday’s win. | Photo by Catherine Ivill/Getty Images\r\n\n \n\n Sunday’s victory versus Spurs brings end to difficult str… [+4260 chars]'), 
    ('LEE', 'SB Nation', 'Holtecast', 'HOLTECAST #284 | Leeds United 0-1 Aston Villa - No Grealish, No Problem', 'Cole Pettem is joined by Danny Raza and Simon O’Regan to go over a prideful win against Leeds United and look ahead to the trip to Bramall Lane on Wednesday against Sheffield United....You can listen for FREE on Acast, Apple Podcasts, and Spotify - Enjoy!', 'https://7500toholte.sbnation.com/aston-villa-podcast-holtecast/2021/3/1/22306351/holtecast-284-leeds-united-0-1-aston-villa', 'https://cdn.vox-cdn.com/thumbor/OKGB-2J0yRwrMihnlzUu1w6-lIs=/0x20:1024x556/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/22335392/Holtecast_Podcast___Template___7500_Website.jpg', '2021-03-01T18:35:00Z', 'Cole Pettem is joined by Danny Raza and Simon O’Regan to go over a prideful win against Leeds United and look ahead to the trip to Bramall Lane on Wednesday against Sheffield United....You can listen… [+1334 chars]');

INSERT INTO users_articles (user_id, article_id)
    VALUES  
        (1, 3),
        (2, 2);


COMMIT;


