import { PrismaClient } from '@prisma/client';
import { AuthorTypesEnum } from '../src/author-types/entities/author-types.enum';
import { FeedbackStatusesEnum } from '../src/feedback-statuses/types/feedback-statuses.enum';
import { ReleaseMediaStatusesEnum } from '../src/release-media-statuses/entities/release-media-statuses.enum';
import { ReleaseMediaTypesEnum } from '../src/release-media-types/entities/release-media-types.enum';
import { ReleaseRatingTypesEnum } from '../src/release-rating-types/entities/release-rating-types.enum';
import { ReleaseTypesEnum } from '../src/release-types/entities/release-types.enum';
import { UserRoleEnum } from '../src/roles/types/user-role.enum';

const prisma = new PrismaClient();

async function main() {
  await prisma.author.deleteMany();
  await prisma.authorType.deleteMany();
  await prisma.authorOnType.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.socialMedia.deleteMany();
  await prisma.profileSocialMedia.deleteMany();
  await prisma.release.deleteMany();
  await prisma.releaseType.deleteMany();
  await prisma.releaseArtist.deleteMany();
  await prisma.releaseDesigner.deleteMany();
  await prisma.releaseProducer.deleteMany();
  await prisma.review.deleteMany();
  await prisma.releaseRating.deleteMany();
  await prisma.releaseRatingDetails.deleteMany();
  await prisma.releaseRatingType.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.feedbackStatus.deleteMany();
  await prisma.userFavAuthor.deleteMany();
  await prisma.userFavRelease.deleteMany();
  await prisma.userFavReview.deleteMany();
  await prisma.topUsersLeaderboard.deleteMany();
  await prisma.releaseMediaStatus.deleteMany();
  await prisma.releaseMediaType.deleteMany();

  await prisma.role.createMany({
    data: [
      {
        id: '4',
        role: UserRoleEnum.ROOT_ADMIN,
      },
      {
        id: '3',
        role: UserRoleEnum.ADMIN,
      },
      {
        id: '2',
        role: UserRoleEnum.SUPER_USER,
      },
      {
        id: '1',
        role: UserRoleEnum.USER,
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        id: '1',
        email: 'GoneFF@gmail.com',
        nickname: 'GoneFF',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '3',
      },
      {
        id: '2',
        email: 'ar4iks@gmail.com',
        nickname: 'ar4iks',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '3',
        email: 'corobok228@gmail.com',
        nickname: 'corobok228',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '4',
        email: 'Gamarjoba@gmail.com',
        nickname: 'Gamarjoba',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '5',
        email: '6g6@gmail.com',
        nickname: '6g6',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '6',
        email: 'ChebuR@gmail.com',
        nickname: 'ChebuR',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '7',
        email: 'meshok@gmail.com',
        nickname: 'Meshok',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '8',
        email: 'norizeek@gmail.com',
        nickname: 'norizeek',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '9',
        email: 'SPlash@gmail.com',
        nickname: 'SPlash',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '10',
        email: 'panikaa_@gmail.com',
        nickname: 'panikaa_',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '11',
        email: 'THUNDER_BITS@gmail.com',
        nickname: 'THUNDER_BITS',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
    ],
  });

  await prisma.feedbackStatus.createMany({
    data: [
      {
        id: '0',
        status: FeedbackStatusesEnum.NEW,
      },
      {
        id: '1',
        status: FeedbackStatusesEnum.ANSWERED,
      },
      {
        id: '2',
        status: FeedbackStatusesEnum.READ,
      },
    ],
  });

  await prisma.feedback.createMany({
    data: [
      {
        email: 'user1@example.com',
        title: 'Проблема с авторизацией',
        message: 'Не могу войти в аккаунт, пишет "Неверный пароль"',
        feedbackStatusId: '0',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        email: 'user2@example.com',
        title: 'Вопрос по оплате',
        message: 'Как отменить подписку?',
        feedbackStatusId: '1',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        email: 'support@company.com',
        title: 'Предложение сотрудничества',
        message: 'Хотим предложить партнерство вашей платформе',
        feedbackStatusId: '2',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      },
      {
        email: 'customer3@mail.ru',
        title: 'Баги в мобильном приложении',
        message: 'Приложение вылетает при открытии профиля',
        feedbackStatusId: '0',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        email: 'webmaster@gmail.com',
        title: 'Не работает форма',
        message: 'Форма обратной связи не отправляет данные',
        feedbackStatusId: '1',
        createdAt: new Date(Date.now() - 5 * 3600 * 1000),
      },
      {
        email: 'john.doe@yahoo.com',
        title: 'Срочный вопрос',
        message: 'Мой заказ не отображается в истории',
        feedbackStatusId: '0',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        email: 'alice.smith@proton.me',
        title: 'Жалоба на сервис',
        message: 'Очень долгая загрузка страниц',
        feedbackStatusId: '2',
        createdAt: new Date(Date.now() - 7 * 3600 * 1000),
      },
      {
        email: 'feedback@site.org',
        title: 'Отзыв о продукте',
        message: 'Отличный сервис, но нужно добавить темную тему',
        feedbackStatusId: '1',
        createdAt: new Date(Date.now() - 8 * 3600 * 1000),
      },
      {
        email: 'random_user@temp-mail.com',
        title: 'Техническая проблема',
        message: 'Не приходит письмо подтверждения',
        feedbackStatusId: '0',
        createdAt: new Date(Date.now() - 9 * 3600 * 1000),
      },
      {
        email: 'manager@business.com',
        title: 'Корпоративный запрос',
        message: 'Нужен доступ для 10 сотрудников',
        feedbackStatusId: '1',
        createdAt: new Date(Date.now() - 10 * 3600 * 1000),
      },
      {
        email: 'test_account@test.com',
        title: 'Тестовое сообщение',
        message: 'Это тестовое сообщение для проверки работы формы',
        feedbackStatusId: '2',
        createdAt: new Date(Date.now() - 11 * 3600 * 1000),
      },
      {
        email: 'webdev@agency.net',
        title: 'Вопрос по API',
        message: 'Где найти документацию по вашем API?',
        feedbackStatusId: '0',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000),
      },
      {
        email: 'newsletter@subscriber.co',
        title: 'Отписаться от рассылки',
        message: 'Пожалуйста, удалите меня из вашей рассылки',
        feedbackStatusId: '1',
        createdAt: new Date(Date.now() - 13 * 3600 * 1000),
      },
      {
        email: 'mobile_user@android.com',
        title: 'Проблема с уведомлениями',
        message: 'Не приходят push-уведомления на Android',
        feedbackStatusId: '2',
        createdAt: new Date(Date.now() - 14 * 3600 * 1000),
      },
      {
        email: 'last_user@example.org',
        title: 'Благодарность',
        message: 'Спасибо за быстрый ответ на мой предыдущий запрос!',
        feedbackStatusId: '1',
        createdAt: new Date(Date.now() - 15 * 3600 * 1000),
      },
    ],
  });

  await prisma.userProfile.createMany({
    data: [
      {
        id: '1',
        avatar: 'GoneFF.png',
        coverImage: '0.png',
        bio: 'young designer from sp',
        userId: '1',
        points: 152892,
      },
      {
        id: '2',
        avatar: 'ar4iks.png',
        bio: 'young designer from sp',
        coverImage: 'ar4iks.png',
        userId: '2',
        points: 89324,
      },
      {
        id: '3',
        avatar: 'corobok228.png',
        coverImage: 'corobok228.png',
        bio: 'young designer from sp',
        userId: '3',
        points: 24295,
      },
      {
        id: '4',
        avatar: 'gamarjoba.png',
        bio: 'young designer from sp',
        userId: '4',
        points: 5769,
      },
      {
        id: '5',
        avatar: '6g6.png',
        coverImage: '6g6.png',
        bio: 'young designer from sp',
        userId: '5',
        points: 7769,
      },
      {
        id: '6',
        bio: 'young designer from sp',
        userId: '6',
      },
      {
        id: '7',
        bio: 'young designer from sp',
        userId: '7',
      },
      {
        id: '8',
        avatar: 'norizeek.png',
        coverImage: 'norizeek.png',
        bio: 'young designer from sp',
        userId: '8',
        points: 93295,
      },
      {
        id: '9',
        avatar: 'SPlash.png',
        bio: 'young designer from sp',
        userId: '9',
      },
      {
        id: '10',
        bio: 'young designer from sp',
        userId: '10',
      },
      {
        id: '11',
        avatar: 'THUNDER_BITS.png',
        bio: 'young designer from sp',
        userId: '11',
        points: 12,
      },
    ],
  });

  await prisma.socialMedia.createMany({
    data: [
      {
        id: '1',
        name: 'Telegram',
      },
      {
        id: '2',
        name: 'YouTube',
      },
      {
        id: '3',
        name: 'Twitch',
      },
      {
        id: '4',
        name: 'VK',
      },
    ],
  });

  await prisma.profileSocialMedia.createMany({
    data: [
      {
        id: '1',
        profileId: '1',
        socialId: '1',
        url: 'https://www.google.com/',
      },
      {
        id: '2',
        profileId: '1',
        socialId: '2',
        url: 'https://www.google.com/',
      },
      {
        id: '3',
        profileId: '1',
        socialId: '3',
        url: 'https://www.google.com/',
      },
      {
        id: '4',
        profileId: '1',
        socialId: '4',
        url: 'https://www.google.com/',
      },
    ],
  });

  await prisma.releaseType.createMany({
    data: [
      {
        id: '1',
        type: ReleaseTypesEnum.ALBUM,
      },
      {
        id: '3',
        type: ReleaseTypesEnum.SINGLE,
      },
    ],
  });

  await prisma.authorType.createMany({
    data: [
      {
        id: '1',
        type: AuthorTypesEnum.ARTIST,
      },
      {
        id: '2',
        type: AuthorTypesEnum.PRODUCER,
      },
      {
        id: '3',
        type: AuthorTypesEnum.DESIGNER,
      },
    ],
  });

  await prisma.author.createMany({
    data: [
      {
        id: '1',
        name: 'Cold carti',
        avatarImg: '0.png',
        coverImg: 'carti.png',
      },
      {
        id: '2',
        name: 'xmindmemories',
        avatarImg: '2.png',
      },
      {
        id: '3',
        name: 'SALUKI',
        avatarImg: '3.png',
        coverImg: '3.png',
      },
      {
        id: '4',
        name: 'Markul',
        avatarImg: '4.png',
        coverImg: '4.png',
      },
      {
        id: '5',
        name: 'Heronwater',
        avatarImg: '5.png',
        coverImg: '5.png',
      },
      {
        id: '6',
        name: 'PHARAOH',
        avatarImg: '6.png',
        coverImg: '6.png',
      },
      {
        id: '7',
        name: 'Meep',
        avatarImg: '7.png',
      },
      {
        id: '8',
        name: 'Shumno',
        avatarImg: '8.png',
      },
      {
        id: '9',
        name: 'Lawzy',
        avatarImg: '9.png',
      },
      {
        id: '10',
        name: 'Wex',
        avatarImg: '10.png',
      },
      {
        id: '11',
        name: 'Gokudo',
        avatarImg: '11.png',
      },
      {
        id: '12',
        name: 'Palagin',
        avatarImg: '12.png',
      },
    ],
  });

  await prisma.authorOnType.createMany({
    data: [
      {
        authorId: '1',
        authorTypeId: '1',
      },
      {
        authorId: '2',
        authorTypeId: '2',
      },
      {
        authorId: '3',
        authorTypeId: '1',
      },
      {
        authorId: '3',
        authorTypeId: '2',
      },
      {
        authorId: '4',
        authorTypeId: '1',
      },
      {
        authorId: '5',
        authorTypeId: '1',
      },
      {
        authorId: '5',
        authorTypeId: '2',
      },
      {
        authorId: '6',
        authorTypeId: '1',
      },
      {
        authorId: '7',
        authorTypeId: '2',
      },
      {
        authorId: '8',
        authorTypeId: '2',
      },
      {
        authorId: '9',
        authorTypeId: '2',
      },
      {
        authorId: '10',
        authorTypeId: '2',
      },
      {
        authorId: '11',
        authorTypeId: '2',
      },
      {
        authorId: '12',
        authorTypeId: '2',
      },
    ],
  });

  await prisma.release.createMany({
    data: [
      {
        id: '1',
        publishDate: new Date('2024-09-27').toISOString(),
        title: 'всегда ненавидел быть слабым',
        img: '0.png',
        releaseTypeId: '1',
      },
      {
        id: '2',
        publishDate: new Date('2024-04-26').toISOString(),
        title: 'тебе жаль это слышать, Ч. 2',
        img: '2.png',
        releaseTypeId: '1',
      },
      {
        id: '3',
        publishDate: new Date('2025-04-25').toISOString(),
        title: '10:13',
        img: '3.png',
        releaseTypeId: '1',
      },
      {
        id: '4',
        publishDate: new Date('2022-03-25').toISOString(),
        title: 'Халливуд Хоус',
        img: '4.png',
        releaseTypeId: '3',
      },
      {
        id: '5',
        publishDate: new Date('2024-11-22').toISOString(),
        title: 'MAKE DEPRESSION GREAT AGAIN',
        img: '5.png',
        releaseTypeId: '1',
      },
      {
        id: '6',
        publishDate: new Date('2021-10-15').toISOString(),
        title: 'Sense Of Human',
        img: '6.png',
        releaseTypeId: '1',
      },
      {
        id: '7',
        publishDate: new Date('2018-10-16').toISOString(),
        title: 'Great Depression',
        img: '7.png',
        releaseTypeId: '1',
      },
      {
        id: '8',
        publishDate: new Date('2021-10-15').toISOString(),
        title: 'Без фокусов',
        img: '6.png',
        releaseTypeId: '3',
      },
      {
        id: '9',
        publishDate: new Date('2024-06-28').toISOString(),
        title: 'Низкие температуры',
        img: '9.png',
        releaseTypeId: '3',
      },
      {
        id: '10',
        publishDate: new Date('2024-11-15').toISOString(),
        title: 'BOLSHIE KURTKI',
        img: '10.png',
        releaseTypeId: '1',
      },
      {
        id: '11',
        publishDate: new Date('2025-04-11').toISOString(),
        title: '1ST DAY SMOKE',
        img: '11.png',
        releaseTypeId: '3',
      },
      {
        id: '12',
        publishDate: new Date('2024-11-15').toISOString(),
        title: 'Dreamin Freestyle',
        img: '12.png',
        releaseTypeId: '3',
      },
      {
        id: '13',
        publishDate: new Date('2023-09-29').toISOString(),
        title: 'Любить буду',
        img: '13.png',
        releaseTypeId: '3',
      },
      {
        id: '14',
        publishDate: new Date('2024-11-8').toISOString(),
        title: 'Осадки',
        img: '14.png',
        releaseTypeId: '3',
      },
      {
        id: '15',
        publishDate: new Date('2021-10-1').toISOString(),
        title: 'Zima Blue',
        img: '15.png',
        releaseTypeId: '3',
      },
    ],
  });

  await prisma.releaseMediaStatus.createMany({
    data: [
      {
        id: '0',
        status: ReleaseMediaStatusesEnum.PENDING,
      },
      {
        id: '1',
        status: ReleaseMediaStatusesEnum.APPROVED,
      },
      {
        id: '2',
        status: ReleaseMediaStatusesEnum.REJECTED,
      },
    ],
  });

  await prisma.releaseMediaType.createMany({
    data: [
      {
        id: '0',
        type: ReleaseMediaTypesEnum.MEDIA_REVIEW,
      },
      {
        id: '1',
        type: ReleaseMediaTypesEnum.MUSIC_VIDEO,
      },
      {
        id: '2',
        type: ReleaseMediaTypesEnum.MEDIA_MATERIAL,
      },
      {
        id: '3',
        type: ReleaseMediaTypesEnum.SNIPPET,
      },
    ],
  });

  await prisma.releaseMedia.createMany({
    data: [
      {
        id: '0',
        title: 'MARKUL — Sense Of Human | Реакция и разбор альбома',
        url: 'https://www.youtube.com/watch?v=4X2mUK96Ho4',
        releaseId: '6',
        releaseMediaTypeId: '0',
        releaseMediaStatusId: '1',
        userId: '1',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '1',
        title: 'MAKING OF SENSE OF HUMAN (2021)',
        url: 'https://www.youtube.com/watch?v=6lb1yEBz3PM',
        releaseId: '6',
        releaseMediaTypeId: '2',
        releaseMediaStatusId: '1',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: '2',
        title: 'Markul — MAKE DEPRESSION GREAT AGAIN | Реакция и разбор',
        url: 'https://www.youtube.com/watch?v=NoJiiOIU2us',
        releaseId: '5',
        releaseMediaTypeId: '0',
        releaseMediaStatusId: '1',
        userId: '1',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      },
      {
        id: '3',
        title: 'PHARAOH — 10:13 | Разбор альбома',
        url: 'https://www.youtube.com/watch?v=1AcqGB6edo8',
        releaseId: '3',
        releaseMediaTypeId: '0',
        releaseMediaStatusId: '1',
        userId: '1',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        id: '4',
        title: 'SALUKI — BOLSHIE KURTKI | Реакция и разбор',
        url: 'https://www.youtube.com/watch?v=MIr5VWegwcY&t=12703s',
        releaseId: '10',
        releaseMediaTypeId: '0',
        releaseMediaStatusId: '1',
        userId: '1',
        createdAt: new Date(Date.now() - 5 * 3600 * 1000),
      },
      {
        id: '5',
        title: 'Heronwater — 1ST DAY SMOKE | Разбор трека',
        url: 'https://www.youtube.com/watch?v=jZmJBTlAg4U',
        releaseId: '11',
        releaseMediaTypeId: '0',
        releaseMediaStatusId: '1',
        userId: '1',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
    ],
  });

  await prisma.releaseArtist.createMany({
    data: [
      {
        releaseId: '1',
        authorId: '1',
      },
      {
        releaseId: '2',
        authorId: '1',
      },
      {
        releaseId: '3',
        authorId: '6',
      },
      {
        releaseId: '4',
        authorId: '6',
      },
      {
        releaseId: '5',
        authorId: '4',
      },
      {
        releaseId: '6',
        authorId: '4',
      },
      {
        releaseId: '7',
        authorId: '4',
      },
      {
        releaseId: '8',
        authorId: '3',
      },
      {
        releaseId: '8',
        authorId: '4',
      },
      {
        releaseId: '9',
        authorId: '4',
      },
      {
        releaseId: '10',
        authorId: '3',
      },
      {
        releaseId: '11',
        authorId: '5',
      },
      {
        releaseId: '12',
        authorId: '5',
      },
      {
        releaseId: '13',
        authorId: '5',
      },
      {
        releaseId: '14',
        authorId: '4',
      },
      {
        releaseId: '15',
        authorId: '4',
      },
    ],
  });

  await prisma.releaseProducer.createMany({
    data: [
      {
        releaseId: '1',
        authorId: '2',
      },
      {
        releaseId: '2',
        authorId: '2',
      },
      {
        releaseId: '4',
        authorId: '6',
      },
      {
        releaseId: '4',
        authorId: '7',
      },
      {
        releaseId: '8',
        authorId: '3',
      },
      {
        releaseId: '9',
        authorId: '8',
      },
      {
        releaseId: '10',
        authorId: '3',
      },
      {
        releaseId: '11',
        authorId: '5',
      },
      {
        releaseId: '11',
        authorId: '9',
      },
      {
        releaseId: '11',
        authorId: '10',
      },
      {
        releaseId: '13',
        authorId: '11',
      },
      {
        releaseId: '14',
        authorId: '12',
      },
      {
        releaseId: '15',
        authorId: '8',
      },
    ],
  });

  await prisma.releaseRatingType.createMany({
    data: [
      {
        id: '1',
        type: ReleaseRatingTypesEnum.NO_TEXT,
      },
      {
        id: '2',
        type: ReleaseRatingTypesEnum.WITH_TEXT,
      },
      {
        id: '3',
        type: ReleaseRatingTypesEnum.SUPER_USER,
      },
    ],
  });

  await prisma.review.createMany({
    data: [
      // ------------------------------- 1
      {
        id: '1',
        releaseId: '1',
        userId: '1',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Глубоко на понятном',
        text: 'сейчас в себе🖤 — Прекрасное открытие альбома, которое уже заявляет нам о том, что нас ожидает интересный инструментал, красивый и глубоко пропитанный смыслом текст, а также интересная подача. В тексте конкретно этого трека есть несколько строчек, которые я готов размещать в своих соц сетях в качестве описания, потому что они звучат слишком красиво и лаконично. Многообещающе',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '2',
        releaseId: '1',
        userId: '2',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 9,
        atmosphere: 10,
        total: 88,
        title: 'Становление большим артистом',
        text: 'Слежу за Женей уже года два, и радуюсь, что о нем узнает все больше людей. Очень ждал этот альбом, потому что прошлые ep засели в плейлист надолго, я ждал полноценный альбом; и бах выходит пререлиз в виде «музыка и счастье», после прослушивания которого, я был в предвкушении.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: '3',
        releaseId: '1',
        userId: '3',
        rhymes: 7,
        structure: 7,
        realization: 8,
        individuality: 7,
        atmosphere: 8,
        total: 60,
        title: 'Крайне неоднозначно',
        text: '•Сейчас в себе - хороший трек, задающий тенденцию последующего звучания альбома и примитивизма текстовой составляющей\n• постоянно - один из показательных треков альбома,выпячивающий,как по мне,откровенную лень в отношении работы с текстами. Карти может невелировать однобокость и простоту текстов аудио составляющей,но когда припевы трека состоят из повторении одной фразы,сложно сделать так,чтобы он не приелся слушателю спустя пары тройки десятков секунд прослушивания ( В детстве не любил качели, но сейчас они меня догнали)\n• всё тебе радо - хороший лиричный трек уже в его хорошо освоенном стиле. Трек для прогулки летним вечером. Припев напомнил мне лиричность Басты,и такие намётки не могут не радовать,если честно.',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      },
      {
        id: '4',
        releaseId: '1',
        userId: '4',
        rhymes: 10,
        structure: 9,
        realization: 9,
        individuality: 10,
        atmosphere: 10,
        total: 86,
        title: 'Карти вырос',
        text: 'Только что дослушал альбом и хочу поделиться впечатлениями.\n\nСам Карти сказал, что это альбом скорее ради текста, нежели звука, и это очень хорошо описывает 1-ю половину альбома. Во второй же половине и звучание, и рифмы становятся куда интереснее.',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        id: '5',
        releaseId: '1',
        userId: '5',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Музыкальная терапия',
        text: 'Женя Cold Carti стал для меня ярчайшим открытием 2023 года с его альбомом "Тебе жаль это слышать", забравший себе значительную часть хронометража в моих плейлистах. Для меня он стал тем артистом, к творчеству которого я могу обратится в любой момент своей жизни.\n\nХочу начать сразу с минуса, но это минус на который абсолютно никто не обратит внимания - ощущение того, насколько быстро пролетают 10 треков. Каждый трек это безумно искренняя история, в которую веришь, в которой переживаешь и в голове "как же ... это жизненно". На этом минусы альбома заканчиваются. Реализация 9 ( в голове 10 ).\n\nТекст 10 и это невозможно отрицать. Неописуемо красивые строки, неуходящие от главной темы альбома - саморефлексии.',
        createdAt: new Date(Date.now() - 5 * 3600 * 1000),
      },
      {
        id: '6',
        releaseId: '1',
        userId: '6',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Да это же 90!',
        text: 'Для меня это первый настоящий альбом Cold carti! Альбом который послушают к сожалению немногие и это очень грустно, ведь этот альбом заслуживает внимания! Это топовый уровень, Жень!\nНачну с того, что это самая качественная работа Карти, это эталон альбомов! Для меня настоящий альбом должен выглядеть именно так!\nЯ считаю главное, чем может похвастаться данный альбом, это развитие! От начала до конца мы вместе с артистом проживаем историю. В релизе есть завязка, где артист рассказывает как ему сейчас плохо, делится своими чувствами и переживаниями, развитие, сильнейшая кульминация в центральном треке "музыка или счастье" прекрасная развязка где артист отпускает все свое прошлое и меняется в лучшую или худшую сторону и концовка, в которой герой полностью переосознает этот мир, переосознает себя и отношения.\nСдержанное количество треков, это даже не минус в данном релизе, если бы их было больше, думаю во время прослушивания могла б потеряться та нить, которая тянется из трека в трек.',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        id: '7',
        releaseId: '1',
        userId: '7',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        id: '8',
        releaseId: '1',
        userId: '8',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Красота в Слабости',
        text: 'От релиза я получил максимальное удовольствие. По ходу прослушивания, я начал больше знать Женю как человека. Сам артист сказал вникать в текст релиза, а не в сам звук. Выливая всю душу, артист сталкивался со многими проблемами. В релизе я выявил что Карти рассказывал о своей истории жизни, о взглядах на жизнь, о несостоявшихся любовных историй, о взрослении. Слабость артиста в пластинке проявляется как прогрессия. Со всеми слабостями артист смог разрешить и по ходу релиза становится всё сильнее-сильнее.',
        createdAt: new Date(Date.now() - 26 * 3600 * 1000),
      },
      {
        id: '9',
        releaseId: '1',
        userId: '9',
        rhymes: 10,
        structure: 9,
        realization: 10,
        individuality: 8,
        atmosphere: 10,
        total: 83,
        title: 'Открытие года!',
        text: 'Даже не знаю с чего начать.\nЭмоции и чувства которые я получил от прослушивания данного релиза могут равняться только с альбомом Майота «Оба».\nКачество на высоте, ритмика прекрасна, звук потрясающий правда.\nРешил послушать альбом чисто из-за высокой оценки Фломастера и готов сказать что оценка полностью оправдывает себя.\nДля меня лично этот альбом забрал осень и зиму, вайб 11/10.\nС радостью ознакомлюсь с прошлыми работами этого автора и буду следить за его творчеством.\nУверен что сможет забрать звание «Открытие года» себе.',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000),
      },
      {
        id: '10',
        releaseId: '1',
        userId: '10',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 81,
        title: 'Как же он чувствует',
        text: 'До этого альбома никогда не слышал творчество cold carti, но после прослушивания понял почему многим людям нравится его творчество. Безумная атмосфера и жизненный сторитейлинг прослеживается во всем альбоме, каждый трек перетекает в следующий что делает его безумно целостным и концептуальный. Обязательно к ознакомлению!',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000),
      },
      // ------------------------------- 2
      {
        id: '11',
        releaseId: '2',
        userId: '1',
        rhymes: 8,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 79,
        title: 'На голову выше первой части',
        text: 'Спустя чуть больше года выходит вторая часть прекрасного релиза. Здесь артист уже нарастил свои способности и показывает более детально проработанную работу чем раньше. Видно старания артиста и за это хочется просто сказать спасибо. Давайте подробнее к оценкам: Рифмы / Образы - 8: Текст стал чуть лучше, но не настолько, чтобы ставить ему 9 или 10. Просто более укреплённый чем раньше, вот и всё. Нельзя сказать что он плохой, местами очень интересный и запоминающийся, но только местами к сожалению. \n\nСтруктура / Ритмика - 9: Здесь артист вырос и показывает более проработанную структуру. Артист всё так же хорошо читает и к той же ритмике нет вопросов. Душноты в треках не заметил да и хронометраж не даёт сильно душнить.\n\nРеализация стиля - 9: Биты стали ещё краше и более проработанные. Конечно есть куда расти, но оцениваем мы конкретно этот релиз и тут оценка 9. Сведос очень хороший и артиста слышно хорошо.\n\nИндивидуальность / харизма - 9: Видно что он поработал над собой и стал выдавать всё более интересный материал, и как можно понять, превратился в более необычного артиста.\n\nАтмосфера / вайб - 10: Этот релиз мне очень нравится. Он не даёт тебе заскучать ведь каждый трек выполнен по разному и оставляет необычные ощущения. При этом в каждом треке, лично для меня, присутствует спокойствие, которое наполняет меня при прослушивании.\n\nВ итоге хочу сказать, что артист большой молодец. Вырос во всех аспектах и показывает всё более интересные работы. И как показывает настоящее, он хочет развиваться и показывать слушателям всё более интересный материал.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '12',
        releaseId: '2',
        userId: '2',
        rhymes: 9,
        structure: 10,
        realization: 9,
        individuality: 8,
        atmosphere: 10,
        total: 81,
        title: 'Умеет красиво изложить',
        text: 'Звучит сильнее первой части и это очень хорошо заметно.\n\nРифмы/образы (9) – текст в большой часьи очень хорош, невозможно найти места, где текст очень, даже если есть просадки, то они не очень заметны происходящие, душных повторений как мне - нет, но многие считают, что из-за долгих припевов звучит душно, но не соглашусь, ведь они больше всего погружают в атмосфера продолжения и самого трека.\n\nСтруктура/Ритмика (10) - она идеальна, кто-то хочет поспорить? Структура не скучная и ритмика не даёт заскучать, поэтому тут смело можно ставить 10 без сомнений или вопросов. До чего только можно докопаться это только до очень долгих ожиданий следующего парта, либо припева.\n\nРеализация стиля (9) - потому что есть до чего можна придраться и найти моменты, где есть что-то не то, чего не хватает, возможно я сильно ошибаюсь и могу быть не прав в данный момент, но я лично считаю, что 9 тут будет 100% твёрдая, но никаким образом не 10.\n\nИндивидуальность/харизма - (8) возможно снова не прав, но она есть сама харизма, но немного не та, которую хотелось ожидать.Треки идеальны по всем категориям, но минусы найти можна, если послушать это намного больше раз, чем один или два раза.\n\nКак фанат могу сказать, что это не провал, но не успех, но очень сильная и крепкая работа. Но также претендовать на что-то большее пока что не может.\n\nЖдём дальнейших работ, таких же сильных и крепких.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '13',
        releaseId: '2',
        userId: '3',
        rhymes: 5,
        structure: 5,
        realization: 5,
        individuality: 5,
        atmosphere: 1,
        total: 28,
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      // ------------------------------- 3
      {
        id: '14',
        releaseId: '3',
        userId: '11',
        rhymes: 9,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 88,
        title: 'Один из лучших в карьере',
        text: 'Альбом ждал с нетерпением как только был анонсирован Глебом, ожидания были высочайшие. С момента дропа Филармонии и Фриквенси хотелось хоть немного, но старого Фараона версии 2016-2018 агрессивного, читающего Фараона, но в праймовом качестве. В принципе это я и получил на это альбоме и довольно таки предостаточно. Чем мне нравится альбом Фосфор, это его атмосферой и битами, которые соответствуют этой атмосфере, думаю с этим старые фанаты Глеба со мной согласятся. Здесь биты очень даже атмосферные и отдают очень сильно старым стилем Фараона. При первом прослушивании на реакции Флома в записи (Риса) довольно сильно зашел. Затем при втором прослушивании на реакции пацанов с канала SHOSLYSHNO понравился еще больше.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '15',
        releaseId: '3',
        userId: '1',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 81,
        title: 'Хороший собранный плейлист хороших песен',
        text: 'Альбом дерзкий, фара снова выдал жесткий плейлист. Очень разно звучит, инфлюенс западной музыки прям слышно — от A Milli Лила Уэйна, 2пака до плохого бани. Трек "На крышах" вообще как Trophies Дрейка, но всё сделано под свой вайб, звучит по своему.\n\nПосле прошлых работ, которые я частично скипнул, 10 13 звучит кайфово. Много музла для всех ушей — залетит и тем, кто любит покачать головой, и тем, кто любит когда текст на подумать. Есть треки про любовь, хейт на индустрию, и просто качественная попса.\n\nПесня про рок-стара как и в названии - не очень, но я такое и не люблю особо. В целом — жёстко советую, прям верочка которая многим зайдёт.\n\nТоп треки альбома "10:13": Москва, Танцы на останках, Большая цель, Чисто Символически, Солнце(Попса)\nБоттом трек: Рок Стар Sh',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: '16',
        releaseId: '3',
        userId: '2',
        rhymes: 8,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 79,
        createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      },
      {
        id: '17',
        releaseId: '3',
        userId: '4',
        rhymes: 10,
        structure: 9,
        realization: 9,
        individuality: 10,
        atmosphere: 10,
        total: 86,
        title: 'Лучший в своём стиле',
        text: 'Очень интересный релиз, поскольку раньше я альбомы Фараона полностью не слушал. А тут, сразу после выхода, я понял, что хочу это заценить. И должен сказать, что альбом надо прочувствовать, он не вызывает какие-то отдельные ощущение. 10:13 - это солянка эмоций в жизне одного артиста, который уже давно заявил о себе.\n\nПо итогу хочу сказать, что альбом Глеба - это всё же праздник, не всегда весёлый, но праздник. В 10:13 все истории взяты из жизни Фараона, его детские воспоминания про Москву, его разнообразная личность: Глеб показывает себя, как уличный рэпер, как рокстар, как романтик, как русский парень с постоянными проблемами. Этот образ, я уверен уже многим знаком. Альбому присущи все качества Фараона, за что его слушатель его так любят. Очень классно снова услышать старика, особенно когда этот старичок однажды изменил жанр...',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        id: '18',
        releaseId: '3',
        userId: '5',
        rhymes: 8,
        structure: 8,
        realization: 8,
        individuality: 9,
        atmosphere: 6,
        total: 62,
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },

      // ------------------------------- 4
      {
        id: '19',
        releaseId: '4',
        userId: '1',
        rhymes: 8,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 79,
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        id: '20',
        releaseId: '4',
        userId: '2',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 81,
        title: 'Эго Фары // Спустя 3 года // Legendarity SZN',
        text: 'Синглу 3 года.\n\nЗдесь Глеб в очередной раз дал сильный парт. Трек, который можно разбирать на цитаты. И трек, где Фара вернул и сказал «Siemens».\n\nКайф, что во втором припеве, прям в начале, изменён голос на более агрессивный. Серьёзное эго Глеба здесь сильно и на агрессивном тащит.\n\nТрушный Фара с кучей отсылок. Также сам клипец наполнен мрачной атмосферой, но, при этом, большой красотой. Трек, который спокойно можно разбирать на цитаты и всё это заправлено сильным битом. Мрачный трек, который, по моему мнению, идеально подходит для прослушивания зимой.\n\nPhlow Rage Mode.\n\nВсем Голивудского Риса!',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: '21',
        releaseId: '4',
        userId: '5',
        rhymes: 8,
        structure: 9,
        realization: 9,
        individuality: 10,
        atmosphere: 10,
        total: 81,
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },

      // ------------------------------- 5
      {
        id: '22',
        releaseId: '5',
        userId: '1',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Личная исповедь Маркула.',
        text: '3 года ожидания оказались полностью оправданы, Маркул снова смог удивить своих слушателей и превзойти самого себя.\n\nЕсли sense of human был концептуальным альбомом построенным на теме 7 смертных грехов, то MGDA стал альбомом который является его жизнью. Буквально в каждом треке поется про его жизнь и что он пережил.\n\nДепрессия снова стала великой, в свою очередь Маркул выпустил альбом который можно слушать на репите и каждый раз он будет звучать как в первый раз.',
        createdAt: new Date(Date.now() - 13 * 3600 * 1000),
      },
      {
        id: '23',
        releaseId: '5',
        userId: '7',
        rhymes: 10,
        structure: 8,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 88,
        title: '27 минут чистого удовольствия.',
        text: 'Пожалуй этот альбом запал мне в сердце с самого момента его выхода, качественный звук, способные притянуть к себе внимание текста, все это делает его лучшей работой Маркула. По настоящему взрослой и с глубоким смыслом.\nВ целом по альбому могу сказать что, эта работа уникальна, много таких не бывает.\nХочется посоветовать это произведение искусства каждому человеку окружающему меня.',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000),
      },
      {
        id: '24',
        releaseId: '5',
        userId: '5',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        createdAt: new Date(Date.now() - 15 * 3600 * 1000),
      },
      {
        id: '25',
        releaseId: '5',
        userId: '6',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 81,
        createdAt: new Date(Date.now() - 11 * 3600 * 1000),
      },
      {
        id: '26',
        releaseId: '5',
        userId: '3',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 81,
        title: 'ЛИЧНЫЙ ДНЕВНИК MARKULA',
        text: 'Маркул с каждым альбомом прогрессирует и этот альбом в данный момент времени считается апогеем его творчества. Альбом превосходит по читке Sense of human, и считай в два раза сильнее Great Depression. Все треки разнообразные, особенно запали в душу: MDGA,Колыбельная, Первый раз. Три года ожидания были не зря. Альбом сделал не для чартов, а как осмысление пройденного пути. MDGA отличное интро, которое задаёт атмосферу альбом. Колыбельная это трек про детство и пройденный путь.По моему мнению альбом претендует на звание альбома года, а может и АЛЬБОМ ГОДА. Спасибо Марку за ещё один альбом.',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        id: '27',
        releaseId: '6',
        userId: '1',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Прайм Марка?',
        text: 'Концептуально сильнейшая работа Марка за всё время, на момент выхода второй депрессии (MDGA), от которой я ожидал прорывного звука и погружения в мир депрессии и грусти, если сравнивать Sense of Human с MDGA, то Sense of Human является погружение в мир грехов и пороков Марка, погружение просто космическое, с первый скитов ощущение что ты действительно находишься в том баре и наблюдаешь за всеми грехами Маркула по очереди, будто сам Марк сидит напротив тебя и травит байки о своём прошлом и настоящем, дикторы постарались на славу как и сами артисты. Маркул задал планку качества для 2021 года, до сих пор переслушиваю с наслаждением этот альбом и всё ещё этот альбом не надоедает, есть пару проходных треков, но саму концепцию альбома это не портит, люблю Маркула за его особый подход и трепетному написанию музыки.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '28',
        releaseId: '6',
        userId: '7',
        rhymes: 10,
        structure: 10,
        realization: 9,
        individuality: 10,
        atmosphere: 10,
        total: 88,
        title: 'Концептуально проработанный релиз',
        text: 'Смог удержать и даже превзойти планку после Great Depression.\nРифмы и образы\nМарк отличный текстовик этот альбом не стал исключением, твёрдая 10\nСтруктура\nКонцепт про смертные грехи, ни один трек не затянут, отличное аутро, хороший завершающий трек. 10\nРеализация\nЕсть пару треков, которые мне не зашли и показались, что сведены странновато, только из-за этого 9.\n(Фит с дайсом) Daly, Лабиринт, Никто не увидит\nИндивидуальность\nНа высоте очень узнаваем 10\nАтмосфера\nПолно эпизодов про смертные грехи, которые погружают тебя в эту атмосферу, почти каждый трек связан\nс концептом\n10',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: '29',
        releaseId: '7',
        userId: '1',
        rhymes: 10,
        structure: 8,
        realization: 10,
        individuality: 8,
        atmosphere: 8,
        total: 74,
        title: 'Назад в будущее',
        text: 'Я решил начать серию рецензий на релизы своих любимых артистов и первым будет этот альбом. Многие считают этот альбом первым в дискографии Маркула, он и сам в своих интервью его таким называет, стараясь лишний раз не упоминать другие свои работы. А зря, ведь "Сухим из воды" 2015 года - вполне неплохая пластинка для того времени с хорошим текстом и интересными мыслями, которая кстати и дала первый толчок Марку в светлое будущее. Ну а "Tranzit" 2017 года - очень классный сборник треков, в котором вы сможете найти даже несколько очень громких хитов: Леброн, Mouline Rouge, Последний билет. Там еще в 2011 году выходил альбом "Взвешенный рэп", но даже самые преданные фанаты Маркула о нем либо не знают, либо делают вид, что не знают, поскольку это совсем не уровень, хотя парочка интересных треков там есть. Да, нужно понимать, что выпускай Маркул по сей день подобные альбомы, как эти три, он бы не был тир-1 артистом СНГ и скорее всего уже все давно бы его позабыли, но в становлении артиста это были очень важные релизы.',
        createdAt: new Date(Date.now() - 8 * 3600 * 1000),
      },
      {
        id: '30',
        releaseId: '7',
        userId: '4',
        rhymes: 10,
        structure: 10,
        realization: 8,
        individuality: 8,
        atmosphere: 9,
        total: 78,
        createdAt: new Date(Date.now() - 8 * 3600 * 1000),
      },
      {
        id: '31',
        releaseId: '8',
        userId: '1',
        rhymes: 10,
        structure: 10,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 86,
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '32',
        releaseId: '8',
        userId: '4',
        rhymes: 10,
        structure: 10,
        realization: 8,
        individuality: 8,
        atmosphere: 9,
        total: 78,
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '33',
        releaseId: '8',
        userId: '5',
        rhymes: 10,
        structure: 10,
        realization: 9,
        individuality: 10,
        atmosphere: 10,
        total: 88,
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '34',
        releaseId: '9',
        userId: '1',
        rhymes: 10,
        structure: 10,
        realization: 9,
        individuality: 10,
        atmosphere: 10,
        total: 88,
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '35',
        releaseId: '9',
        userId: '8',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 81,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: '36',
        releaseId: '9',
        userId: '4',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Держит уровень',
        text: 'Первый сингл с альбома, и какой же сильный.\nРифмы / образы\nУ Марка всегда хорошие текста, со смыслом, которые очень интересно слушать. « Сегодня для районов\nзавтра сделал попсово» Да мы дети 90ых значит дети навсегда» « у меня ведь нет работы только песни\nи семья» « Зависть это вирус и я с ними на дистанции»\nСтруктура\nСильнейшее развитие от самого начало и до конца. Особенно понравился припев 10\nРеализация стиля\nА когда не 10? Прайм Марк?\nИндивидуальность\nМастер своего дела, чувствует свой стиль 10\nАтмосфера\nОчень атмосферный трек, очень сильно понравился припев и последний куплет. 10',
        createdAt: new Date(Date.now() - 8 * 3600 * 1000),
      },
      {
        id: '37',
        releaseId: '9',
        userId: '11',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 8,
        total: 82,
        title: 'Очередное доказательство, что Маркул не может сделать плохо',
        text: 'Наконец-то Маркул дропает трек с его грядущего альбома, который многие так сильно ждут. Сказать, что он сильный, это ничего не сказать, но смог ли он меня собой зацепить?\n\nТекста у Маркула всегда сильные, и этот трек не стал исключением. Круто, что он поднимает в этом треке ту же тему, которую поднимал на альбоме "Sense Of Human".\n\nСтруктура - единственное, над чем мне еще пришлось немного подумать. В треке нет повторяющихся\nпартов, что круто, но сначала мне показалось, что куплет кажется слегка затянутым. Но аутро послеприпева заставило меня поставить здесь 10 баллов. Прям отлично оно собой завершило трек.\n\nЗа реализацию здесь не за что снижать. Всё на высшем уровне: бит, сведение, исполнение. Маркул не может сделать плохо.\n\nЗа харизму здесь так же максималка. Нигде даже намека не услышал на просадку в харизме. Всёмаксимально уверенно исполнено.\n\nПо итогу трек получает от меня максимальную базу, но от этого не заходит мне на 100%. Просто нет внем для меня чего-то такого, из-за чего прям сразу же хотелось забрать его в плейлист. Но этобезусловно сильная работа.',
        createdAt: new Date(Date.now() - 10 * 3600 * 1000),
      },
      {
        id: '38',
        releaseId: '10',
        userId: '1',
        rhymes: 6,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 81,
        title: 'ВРЕМЯ НАДЕВАТЬ БОЛЬШИЕ КУРТКИ!',
        text: 'После альбома "Wild East" ожидания были выше некуда. Такое отношение не совсем правильное, ибо Дикий Восток делался в течение нескольких лет, а в данном случае было где-то 1,5 года + мы получили до этого "Beach Rock Hotel". Но несмотря на это, всё равно хотелось невероятного мяса. И грёбаный шеф-повар приготовил его как нельзя лучше!!!\n\nДерзкий, дорогой, эпичный и всё такой же дикий Восток расширяет свою вселенную. Абсолютно новый, но с знакомыми оттенками. Вообще прикольная концепция - грубо-говоря разделить альбомы на части света. "Wild East" - ну тут понятно, это восток. "Beach Rock Hotel" - атмосфера юга, лета и тепла. Ну и "Bolshie Kurtki" - промозглый холод, северная стилистика.',
        createdAt: new Date(Date.now() - 18 * 3600 * 1000),
      },
      {
        id: '39',
        releaseId: '10',
        userId: '2',
        rhymes: 8,
        structure: 9,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 83,
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        id: '40',
        releaseId: '10',
        userId: '3',
        rhymes: 8,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 9,
        total: 84,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: '41',
        releaseId: '11',
        userId: '1',
        rhymes: 8,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 9,
        total: 84,
        createdAt: new Date(Date.now() - 5 * 3600 * 1000),
      },
      {
        id: '42',
        releaseId: '12',
        userId: '5',
        rhymes: 10,
        structure: 9,
        realization: 10,
        individuality: 10,
        atmosphere: 9,
        total: 84,
        title: 'SSCAUTT',
        text: 'Хорошая работа , цепляет . Артисту веришь . Колкие и сильные панчи вызывающие эмоции не могут не работать . Это одна из главных фишек артиста , сильный альбом ! Достойный хорошей оценки . Ставлю 84 балла только потому что знаю что данный артист может сделать еще сильнее и качественнее . Фавориты на альбоме «против ветра» , «не тот парень». От началка до конца альбом вызвал мурашки , последний трек поставил жирную точку . Все так как и должно быть .',
        createdAt: new Date(Date.now() - 9 * 3600 * 1000),
      },
      {
        id: '43',
        releaseId: '12',
        userId: '8',
        rhymes: 8,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 9,
        total: 84,
        createdAt: new Date(Date.now() - 5 * 3600 * 1000),
      },
      {
        id: '44',
        releaseId: '13',
        userId: '8',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Прайм Вотера',
        text: 'Лично для меня это лучший альбом 2023 года, вообще это был отличный год для вотера, тогда он выпустил и большой хит "Дай мне посмотреть" и лучший свой альбом в карьере.\n\nЕсли сравнивать этот альбом с прошлыми, то в нём так же смешной и колкий текст, но в добавок к этому сильный апгрейд в плане звучания и битов. Также к моменту выпуска этого альбома у Вотера уже сформировалась собственная харизма и индивидуальность.\n\nСледует отметить и разнообразие альбома, тут были тречки сделанные в прошлом стиле, например "Мяу", так и треки, которые открыли для Вотера новый жанр, а именно лирику: "Зависим", "2 часа ночи".\n\nЕсли сравнивать DMCB и ODYSSEY, то это оба качественные альбомы с интересными текстами, но чисто по настроению этот альбом мне заходит больше на данный момент.',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      },
      {
        id: '45',
        releaseId: '12',
        userId: '9',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 9,
        total: 78,
        createdAt: new Date(Date.now() - 9 * 3600 * 1000),
      },
      {
        id: '46',
        releaseId: '14',
        userId: '2',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 9,
        total: 78,
        createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      },
      {
        id: '47',
        releaseId: '14',
        userId: '1',
        rhymes: 10,
        structure: 9,
        realization: 10,
        individuality: 10,
        atmosphere: 9,
        total: 84,
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        id: '48',
        releaseId: '15',
        userId: '2',
        rhymes: 10,
        structure: 9,
        realization: 10,
        individuality: 10,
        atmosphere: 9,
        total: 84,
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
    ],
  });

  await prisma.userFavRelease.createMany({
    data: [
      // ------------------------------- 1
      {
        releaseId: '1',
        userId: '1',
      },
      {
        releaseId: '1',
        userId: '2',
      },
      {
        releaseId: '1',
        userId: '4',
      },

      // ------------------------------- 2
      {
        releaseId: '2',
        userId: '2',
      },

      // ------------------------------- 3
      {
        releaseId: '3',
        userId: '1',
      },
      {
        releaseId: '3',
        userId: '2',
      },
      {
        releaseId: '3',
        userId: '11',
      },
      {
        releaseId: '3',
        userId: '4',
      },

      // ------------------------------- 5
      {
        releaseId: '5',
        userId: '1',
      },

      // ------------------------------- 6

      {
        releaseId: '6',
        userId: '1',
      },

      // ------------------------------- 8
      {
        releaseId: '8',
        userId: '1',
      },

      // ------------------------------- 9
      {
        releaseId: '9',
        userId: '1',
      },

      // ------------------------------- 10
      {
        releaseId: '10',
        userId: '1',
      },

      // ------------------------------- 11
      {
        releaseId: '11',
        userId: '1',
      },

      // ------------------------------- 12
      {
        releaseId: '12',
        userId: '1',
      },

      // ------------------------------- 12
      {
        releaseId: '13',
        userId: '1',
      },
    ],
  });

  await prisma.userFavReview.createMany({
    data: [
      // ------------------------------- 1
      {
        reviewId: '8',
        userId: '1',
      },
      {
        reviewId: '2',
        userId: '1',
      },
      {
        reviewId: '16',
        userId: '1',
      },

      // ------------------------------- 2
      {
        reviewId: '1',
        userId: '2',
      },
      {
        reviewId: '8',
        userId: '2',
      },

      // ------------------------------- 3
      {
        reviewId: '8',
        userId: '3',
      },
      {
        reviewId: '16',
        userId: '3',
      },
      {
        reviewId: '15',
        userId: '3',
      },

      // ------------------------------- 4
      {
        reviewId: '1',
        userId: '4',
      },
    ],
  });

  await prisma.userFavAuthor.createMany({
    data: [
      {
        userId: '1',
        authorId: '1',
      },
      {
        userId: '1',
        authorId: '2',
      },
      {
        userId: '1',
        authorId: '3',
      },
      {
        userId: '1',
        authorId: '4',
      },
      {
        userId: '1',
        authorId: '5',
      },
      {
        userId: '1',
        authorId: '6',
      },
      {
        userId: '1',
        authorId: '7',
      },
      {
        userId: '1',
        authorId: '10',
      },
    ],
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
