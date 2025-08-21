import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthorConfirmationStatusesEnum } from '../src/author-confirmation-statuses/types/author-confirmation-statuses.enum';
import { AuthorTypesEnum } from '../src/author-types/entities/author-types.enum';
import { FeedbackStatusesEnum } from '../src/feedback-statuses/types/feedback-statuses.enum';
import { NominationTypesEnum } from '../src/nomination-types/types/nomination-types.enum';
import { ReleaseMediaStatusesEnum } from '../src/release-media-statuses/types/release-media-statuses.enum';
import { ReleaseMediaTypesEnum } from '../src/release-media-types/types/release-media-types.enum';
import { ReleaseTypesEnum } from '../src/release-types/types/release-types.enum';
import { UserRoleEnum } from '../src/roles/types/user-role.enum';
import { ReleaseRatingTypesEnum } from '../src/shared/types/release-rating-types.enum';
import { SocialMediaEnum } from '../src/social-media/types/social-media.enum';

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
  await prisma.authorConfirmationStatus.deleteMany();
  await prisma.authorConfirmation.deleteMany();
  await prisma.authorComment.deleteMany();
  await prisma.userFavMedia.deleteMany();
  await prisma.nominationType.deleteMany();
  await prisma.nominationTypeAllowedAuthorType.deleteMany();
  await prisma.nominationTypeAllowedReleaseType.deleteMany();
  await prisma.nomitationVote.deleteMany();

  const password = await bcrypt.hash('1234567', 10);

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
        role: UserRoleEnum.MEDIA,
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
        password,
        isActive: true,
        roleId: '2',
      },
      {
        id: '2',
        email: 'ar4iks@gmail.com',
        nickname: 'ar4iks',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '3',
        email: 'corobok228@gmail.com',
        nickname: 'corobok228',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '4',
        email: 'Gamarjoba@gmail.com',
        nickname: 'Gamarjoba',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '5',
        email: '6g6@gmail.com',
        nickname: '6g6',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '6',
        email: 'ChebuR@gmail.com',
        nickname: 'ChebuR',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '7',
        email: 'meshok@gmail.com',
        nickname: 'Meshok',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '8',
        email: 'norizeek@gmail.com',
        nickname: 'norizeek',
        password,
        isActive: true,
        roleId: '3',
      },
      {
        id: '9',
        email: 'SPlash@gmail.com',
        nickname: 'SPlash',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '10',
        email: 'panikaa_@gmail.com',
        nickname: 'panikaa_',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '11',
        email: 'THUNDER_BITS@gmail.com',
        nickname: 'THUNDER_BITS',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '12',
        email: 'markul@gmail.com',
        nickname: 'Markul',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '13',
        email: 'saluki@gmail.com',
        nickname: 'Saluki',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '14',
        email: 'crispy@gmail.com',
        nickname: 'Криспи',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '15',
        email: 'lourenz@gmail.com',
        nickname: 'LOURENZ',
        password,
        isActive: true,
        roleId: '1',
      },
      {
        id: '16',
        email: 'msblack@gmail.com',
        nickname: 'Msblack',
        password,
        isActive: true,
        roleId: '1',
      },
    ],
  });

  await prisma.userProfile.createMany({
    data: [
      {
        id: '1',
        avatar: 'GoneFF.png',
        coverImage: '0.png',
        bio: 'GoneFF bio',
        userId: '1',
        points: 152892,
      },
      {
        id: '2',
        avatar: 'ar4iks.png',
        coverImage: 'ar4iks.png',
        userId: '2',
        points: 89324,
      },
      {
        id: '3',
        avatar: 'corobok228.png',
        coverImage: 'corobok228.png',
        userId: '3',
        points: 24295,
      },
      {
        id: '4',
        avatar: 'gamarjoba.png',
        userId: '4',
        points: 5769,
      },
      {
        id: '5',
        avatar: '6g6.png',
        coverImage: '6g6.png',
        userId: '5',
        points: 7769,
      },
      {
        id: '6',
        userId: '6',
      },
      {
        id: '7',
        userId: '7',
      },
      {
        id: '8',
        avatar: 'norizeek.png',
        coverImage: 'norizeek.png',
        userId: '8',
        points: 93295,
      },
      {
        id: '9',
        avatar: 'SPlash.png',
        userId: '9',
      },
      {
        id: '10',
        userId: '10',
      },
      {
        id: '11',
        avatar: 'THUNDER_BITS.png',
        userId: '11',
        points: 12,
      },
      {
        id: '12',
        avatar: 'Markul.png',
        coverImage: 'Markul.png',
        userId: '12',
        bio: 'Зарегистрированный автор Markul',
      },
      {
        id: '13',
        avatar: 'Saluki.png',
        coverImage: 'Saluki.png',
        userId: '13',
        bio: 'Зарегистрированный автор Saluki',
      },
      {
        id: '14',
        avatar: 'Crispy.png',
        coverImage: 'Crispy.png',
        userId: '14',
        bio: 'Зарегистрированный автор Криспи',
      },
      {
        id: '15',
        avatar: 'lourenz.png',
        userId: '15',
        bio: 'Зарегистрированный автор LOURENZ',
      },
      {
        id: '16',
        avatar: 'msblack.png',
        userId: '16',
        bio: 'Зарегистрированный автор Msblack',
      },
    ],
  });

  await prisma.authorConfirmationStatus.createMany({
    data: [
      {
        id: '0',
        status: AuthorConfirmationStatusesEnum.APPROVED,
      },
      {
        id: '1',
        status: AuthorConfirmationStatusesEnum.PENDING,
      },
      {
        id: '2',
        status: AuthorConfirmationStatusesEnum.REJECTED,
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

  await prisma.socialMedia.createMany({
    data: [
      {
        id: '1',
        name: SocialMediaEnum.TELEGRAM,
      },
      {
        id: '2',
        name: SocialMediaEnum.YOUTUBE,
      },
      {
        id: '3',
        name: SocialMediaEnum.TWITCH,
      },
      {
        id: '4',
        name: SocialMediaEnum.VK,
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
      {
        id: '5',
        profileId: '12',
        socialId: '1',
        url: 'https://www.google.com/',
      },
      {
        id: '6',
        profileId: '12',
        socialId: '2',
        url: 'https://www.google.com/',
      },
      {
        id: '7',
        profileId: '14',
        socialId: '2',
        url: 'https://www.google.com/',
      },
      {
        id: '8',
        profileId: '14',
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
        name: 'Криспи',
        avatarImg: '0.png',
        coverImg: '0.png',
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
      {
        id: '13',
        name: 'LOURENZ',
        avatarImg: '13.png',
      },
      {
        id: '14',
        name: 'Msblack',
        avatarImg: '14.png',
      },
      {
        id: '15',
        name: 'кайдãн',
        avatarImg: 'kaidan.png',
      },
      {
        id: '16',
        name: '5opka',
        avatarImg: '5opka.png',
        coverImg: '5opka.png',
      },
      {
        id: '17',
        name: 'MellSher',
        avatarImg: 'MellSher.png',
        coverImg: 'MellSher.png',
      },
      {
        id: '18',
        name: 'BEATCASTER',
        avatarImg: 'BEATCASTER.png',
      },
      {
        id: '19',
        name: 'Мэйби Бэйби',
        avatarImg: 'maybebaby.png',
      },
      {
        id: '20',
        name: 'XWinner',
        avatarImg: 'XWinner.png',
      },
      {
        id: '21',
        name: 'ПОЛМАТЕРИ',
        avatarImg: 'polmateri.png',
        coverImg: 'polmateri.png',
      },
      {
        id: '22',
        name: 'ХА+ЛУЙ',
        avatarImg: '22.png',
      },
      {
        id: '23',
        name: 'Pepel Nahudi',
        avatarImg: '23.png',
        coverImg: '23.png',
      },
      {
        id: '24',
        name: 'галерея корнера',
        avatarImg: '24.png',
      },
      {
        id: '25',
        name: 'SLAVA MARLOW',
        avatarImg: '25.png',
        coverImg: '25.png',
      },
      {
        id: '26',
        name: 'Midix',
        avatarImg: '26.png',
        coverImg: '26.png',
      },
      {
        id: '27',
        name: 'whyisilly',
        avatarImg: '27.png',
      },
      {
        id: '28',
        name: 'NEWLIGHTCHILD',
        avatarImg: '28.png',
      },
    ],
  });

  await prisma.registeredAuthor.createMany({
    data: [
      {
        authorId: '4',
        userId: '12',
      },
      {
        authorId: '3',
        userId: '13',
      },
      {
        authorId: '1',
        userId: '14',
      },
      {
        authorId: '13',
        userId: '15',
      },
      {
        authorId: '14',
        userId: '16',
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
      {
        authorId: '13',
        authorTypeId: '2',
      },
      {
        authorId: '14',
        authorTypeId: '2',
      },
      {
        authorId: '15',
        authorTypeId: '2',
      },
      {
        authorId: '16',
        authorTypeId: '1',
      },
      {
        authorId: '17',
        authorTypeId: '1',
      },
      {
        authorId: '18',
        authorTypeId: '2',
      },
      {
        authorId: '19',
        authorTypeId: '1',
      },
      {
        authorId: '20',
        authorTypeId: '2',
      },
      {
        authorId: '21',
        authorTypeId: '1',
      },
      {
        authorId: '22',
        authorTypeId: '3',
      },
      {
        authorId: '23',
        authorTypeId: '1',
      },
      {
        authorId: '24',
        authorTypeId: '3',
      },
      {
        authorId: '25',
        authorTypeId: '1',
      },
      {
        authorId: '25',
        authorTypeId: '2',
      },
      {
        authorId: '26',
        authorTypeId: '1',
      },
      {
        authorId: '26',
        authorTypeId: '2',
      },
      {
        authorId: '27',
        authorTypeId: '3',
      },
      {
        authorId: '28',
        authorTypeId: '1',
      },
    ],
  });

  await prisma.release.createMany({
    data: [
      {
        id: 'release2',
        publishDate: new Date('2025-08-15').toISOString(),
        title: 'BLUE EYES DEMON',
        img: '2.png',
        releaseTypeId: '1',
      },
      {
        id: 'release1',
        publishDate: new Date('2023-08-03').toISOString(),
        title: 'DEEP INSIDE',
        img: '0.png',
        releaseTypeId: '1',
      },
      {
        id: 'release3',
        publishDate: new Date('2024-04-05').toISOString(),
        title: '4 Стены',
        img: '4steny.png',
        releaseTypeId: '3',
      },
      {
        id: 'release4',
        publishDate: new Date('2023-11-24').toISOString(),
        title: 'Психолог',
        img: 'release4.png',
        releaseTypeId: '3',
      },
      {
        id: 'release5',
        publishDate: new Date('2024-02-23').toISOString(),
        title: 'Никаких Аргументов',
        img: 'release5.png',
        releaseTypeId: '3',
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
      {
        id: '16',
        publishDate: new Date('2025-07-25').toISOString(),
        title: 'SUPER PUPER NOVA',
        img: '16.png',
        releaseTypeId: '1',
      },
      {
        id: '17',
        publishDate: new Date('2025-07-25').toISOString(),
        title: 'XXL',
        img: '16.png',
        releaseTypeId: '3',
      },
      {
        id: '18',
        publishDate: new Date('2025-07-21').toISOString(),
        title: 'Силиконовый Гном',
        img: '18.png',
        releaseTypeId: '3',
      },
      {
        id: '19',
        publishDate: new Date('2025-07-18').toISOString(),
        title: 'простая замечательная жизнь ипи',
        img: '19.png',
        releaseTypeId: '1',
      },
      {
        id: '20',
        publishDate: new Date('2025-06-27').toISOString(),
        title: 'GARGONNA MUSIC',
        img: '20.png',
        releaseTypeId: '1',
      },
      {
        id: '21',
        publishDate: new Date('2025-06-27').toISOString(),
        title: 'Честных правил',
        img: '21.png',
        releaseTypeId: '3',
      },
      {
        id: '22',
        publishDate: new Date('2025-06-06').toISOString(),
        title: 'НЕ ЗАБЫЛ ╥﹏╥',
        img: '22.png',
        releaseTypeId: '3',
      },
      {
        id: '23',
        publishDate: new Date('2025-06-13').toISOString(),
        title: 'ЭЛЬФ 1',
        img: '23.png',
        releaseTypeId: '1',
      },
      {
        id: '24',
        publishDate: new Date('2025-05-23').toISOString(),
        title: 'Midix x Midix',
        img: '24.png',
        releaseTypeId: '1',
      },
      {
        id: '25',
        publishDate: new Date('2025-05-23').toISOString(),
        title: 'SELFHARM',
        img: '25.png',
        releaseTypeId: '3',
      },
    ],
  });

  await prisma.releaseArtist.createMany({
    data: [
      {
        releaseId: 'release1',
        authorId: '1',
      },
      {
        releaseId: 'release2',
        authorId: '1',
      },
      {
        releaseId: 'release3',
        authorId: '1',
      },
      {
        releaseId: 'release4',
        authorId: '1',
      },
      {
        releaseId: 'release5',
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
      {
        releaseId: '16',
        authorId: '16',
      },
      {
        releaseId: '16',
        authorId: '17',
      },
      {
        releaseId: '17',
        authorId: '16',
      },
      {
        releaseId: '17',
        authorId: '17',
      },
      {
        releaseId: '18',
        authorId: '19',
      },
      {
        releaseId: '19',
        authorId: '21',
      },
      {
        releaseId: '20',
        authorId: '23',
      },
      {
        releaseId: '21',
        authorId: '4',
      },
      {
        releaseId: '22',
        authorId: '3',
      },
      {
        releaseId: '22',
        authorId: '25',
      },
      {
        releaseId: '23',
        authorId: '25',
      },
      {
        releaseId: '24',
        authorId: '26',
      },
      {
        releaseId: '25',
        authorId: '28',
      },
    ],
  });

  await prisma.releaseProducer.createMany({
    data: [
      {
        releaseId: 'release3',
        authorId: '13',
      },
      {
        releaseId: 'release3',
        authorId: '14',
      },
      {
        releaseId: 'release4',
        authorId: '15',
      },
      {
        releaseId: 'release5',
        authorId: '15',
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
      {
        releaseId: '17',
        authorId: '18',
      },
      {
        releaseId: '18',
        authorId: '20',
      },
      {
        releaseId: '19',
        authorId: '21',
      },
      {
        releaseId: '21',
        authorId: '4',
      },
      {
        releaseId: '21',
        authorId: '8',
      },
      {
        releaseId: '21',
        authorId: '12',
      },
      {
        releaseId: '22',
        authorId: '25',
      },
      {
        releaseId: '23',
        authorId: '25',
      },
      {
        releaseId: '24',
        authorId: '26',
      },
    ],
  });

  await prisma.releaseDesigner.createMany({
    data: [
      {
        releaseId: '19',
        authorId: '22',
      },
      {
        releaseId: '20',
        authorId: '24',
      },
      {
        releaseId: '24',
        authorId: '27',
      },
    ],
  });

  await prisma.nominationType.createMany({
    data: [
      {
        id: '0',
        type: NominationTypesEnum.ALBUM_OF_MONTH,
      },
      {
        id: '1',
        type: NominationTypesEnum.ARTIST_OF_MONTH,
      },
      {
        id: '2',
        type: NominationTypesEnum.COVER_OF_MONTH,
      },
      {
        id: '3',
        type: NominationTypesEnum.HIT_OF_MONTH,
      },
      {
        id: '4',
        type: NominationTypesEnum.PRODUCER_OF_MONTH,
      },
    ],
  });

  await prisma.nomitationVote.createMany({
    data: [
      // 2025 ИЮЛЬ
      {
        userId: '1',
        nominationTypeId: '0',
        year: 2025,
        month: 7,
        releaseId: '16',
        createdAt: new Date('2025-8-1'),
      },
      {
        userId: '1',
        nominationTypeId: '1',
        year: 2025,
        month: 7,
        authorId: '19',
        createdAt: new Date('2025-8-1'),
      },
      {
        userId: '1',
        nominationTypeId: '2',
        year: 2025,
        month: 7,
        releaseId: '19',
        createdAt: new Date('2025-8-1'),
      },
      {
        userId: '1',
        nominationTypeId: '3',
        year: 2025,
        month: 7,
        releaseId: '17',
        createdAt: new Date('2025-5-1'),
      },
      {
        userId: '1',
        nominationTypeId: '4',
        year: 2025,
        month: 7,
        authorId: '18',
        createdAt: new Date('2025-5-1'),
      },
      // 2025 ИЮНЬ
      {
        userId: '1',
        nominationTypeId: '0',
        year: 2025,
        month: 6,
        releaseId: '23',
        createdAt: new Date('2025-7-1'),
      },
      {
        userId: '1',
        nominationTypeId: '1',
        year: 2025,
        month: 6,
        authorId: '4',
        createdAt: new Date('2025-7-1'),
      },
      {
        userId: '1',
        nominationTypeId: '2',
        year: 2025,
        month: 6,
        releaseId: '20',
        createdAt: new Date('2025-7-1'),
      },
      {
        userId: '1',
        nominationTypeId: '3',
        year: 2025,
        month: 6,
        releaseId: '21',
        createdAt: new Date('2025-7-1'),
      },
      {
        userId: '1',
        nominationTypeId: '4',
        year: 2025,
        month: 6,
        authorId: '25',
        createdAt: new Date('2025-7-1'),
      },
      // 2025 МАЙ
      {
        userId: '1',
        nominationTypeId: '0',
        year: 2025,
        month: 5,
        releaseId: '24',
        createdAt: new Date('2025-6-1'),
      },
      {
        userId: '1',
        nominationTypeId: '1',
        year: 2025,
        month: 5,
        authorId: '28',
        createdAt: new Date('2025-6-1'),
      },
      {
        userId: '1',
        nominationTypeId: '2',
        year: 2025,
        month: 5,
        releaseId: '24',
        createdAt: new Date('2025-5-1'),
      },
      {
        userId: '1',
        nominationTypeId: '3',
        year: 2025,
        month: 5,
        releaseId: '25',
        createdAt: new Date('2025-6-1'),
      },
      {
        userId: '1',
        nominationTypeId: '4',
        year: 2025,
        month: 5,
        authorId: '26',
        createdAt: new Date('2025-6-1'),
      },

      // 2025 АПРЕЛЬ
      {
        userId: '1',
        nominationTypeId: '0',
        year: 2025,
        month: 4,
        releaseId: '3',
        createdAt: new Date('2025-5-1'),
      },
      {
        userId: '1',
        nominationTypeId: '1',
        year: 2025,
        month: 4,
        authorId: '6',
        createdAt: new Date('2025-5-1'),
      },
      {
        userId: '1',
        nominationTypeId: '2',
        year: 2025,
        month: 4,
        releaseId: '3',
        createdAt: new Date('2025-5-1'),
      },
      {
        userId: '1',
        nominationTypeId: '3',
        year: 2025,
        month: 4,
        releaseId: '11',
        createdAt: new Date('2025-5-1'),
      },
      {
        userId: '1',
        nominationTypeId: '4',
        year: 2025,
        month: 4,
        authorId: '5',
        createdAt: new Date('2025-5-1'),
      },

      // 2024 ФЕВРАЛЬ
      {
        userId: '1',
        nominationTypeId: '0',
        year: 2024,
        month: 2,
        releaseId: 'release5',
        createdAt: new Date('2024-3-1'),
      },
      {
        userId: '1',
        nominationTypeId: '1',
        year: 2024,
        month: 2,
        authorId: '1',
        createdAt: new Date('2024-3-1'),
      },
      {
        userId: '1',
        nominationTypeId: '2',
        year: 2024,
        month: 2,
        releaseId: 'release5',
        createdAt: new Date('2024-3-1'),
      },
      {
        userId: '1',
        nominationTypeId: '3',
        year: 2024,
        month: 2,
        releaseId: 'release5',
        createdAt: new Date('2024-3-1'),
      },
      {
        userId: '1',
        nominationTypeId: '4',
        year: 2024,
        month: 2,
        authorId: '1',
        createdAt: new Date('2024-3-1'),
      },
    ],
  });

  await prisma.authorComment.createMany({
    data: [
      {
        id: '0',
        title:
          'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
        userId: '12',
        releaseId: '5',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ac libero nulla. Vivamus at nibh mattis, cursus odio sed, lacinia ante. Fusce sit amet ligula a mi elementum ultrices. Nunc nulla erat, laoreet id ipsum sit amet, facilisis pharetra felis. Vestibulum ornare elementum velit, eu finibus enim auctor quis. In id lorem commodo, porttitor leo vel, ultricies mauris. Proin ac scelerisque ante. Phasellus id lorem sed urna maximus pretium ut eget eros. Aenean luctus sem ut quam maximus malesuada. Sed semper nisl in massa tempor, quis facilisis orci laoreet. Donec laoreet sit amet tortor id sodales.\n\nCurabitur consequat tellus non lacus posuere, sit amet dignissim dolor sodales. Nunc sodales elit id ante euismod, id aliquet dui interdum. Aliquam bibendum neque vel gravida consectetur. Nam vehicula convallis tortor ornare tristique. Cras lobortis ligula aliquam arcu sollicitudin vulputate. Integer nisi velit, vulputate et posuere ut, bibendum ac ante. Phasellus cursus lectus in luctus iaculis. In hac habitasse platea dictumst. Nullam eget eleifend dolor, sit amet tincidunt justo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce commodo erat feugiat mauris sodales, vel pulvinar sem pretium. Duis accumsan, dolor vel pretium tincidunt, mi purus dapibus ligula, eget facilisis augue ligula a enim. Ut tellus metus, congue non purus non, bibendum laoreet felis.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '1',
        title: 'Sed faucibus efficitur risus et accumsan.',
        userId: '12',
        releaseId: '6',
        text: 'Nam tristique massa sed mauris rhoncus vehicula eu sit amet justo. Aenean imperdiet enim convallis pretium porta. Nam vitae ligula iaculis, rutrum ante rhoncus, interdum orci. Nunc ut finibus tellus, ac mollis felis. Etiam rhoncus luctus enim quis fermentum. Donec sit amet turpis ligula. Ut tempor mauris arcu, et suscipit nulla pretium vel. Aliquam efficitur lectus nunc, non accumsan nisl pellentesque feugiat. Sed vehicula blandit justo ac ullamcorper. Phasellus ullamcorper tempus nulla ac finibus. Ut pulvinar orci et ultricies fringilla. Sed id lacus in justo elementum convallis. Donec iaculis augue vel dolor pharetra, quis aliquet ipsum egestas. Sed a finibus dui. Nunc iaculis, felis nec ullamcorper pulvinar, odio lorem placerat sapien, ac porta elit turpis at sem. Proin ultrices ullamcorper ultrices.\n\nVestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis scelerisque consequat. Pellentesque fringilla nibh vitae mauris malesuada, vel malesuada orci fringilla. Maecenas eget dui nulla. Sed vehicula a purus et elementum. Aenean auctor purus nibh, et suscipit mauris auctor eget. Aliquam non efficitur tellus. Quisque fermentum eros justo, a rutrum justo convallis ut. Duis dictum mauris id vestibulum commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ac bibendum tellus. Proin placerat urna a leo egestas, at pulvinar nisl tincidunt. In id metus sem. Curabitur ullamcorper faucibus nisl, sed tempor nulla rhoncus a.',
        createdAt: new Date(Date.now() - 10 * 3600 * 1000),
      },
      {
        id: '2',
        title:
          'Maecenas vitae blandit tortor. Nam sed cursus nunc, id aliquam felis.',
        userId: '12',
        releaseId: '8',
        text: 'Pellentesque dapibus, enim quis tristique lobortis, orci turpis lobortis mauris, at molestie nibh massa in elit. Mauris interdum risus et imperdiet scelerisque. Nulla vitae hendrerit mi, id consequat leo. Vestibulum urna velit, lacinia lobortis facilisis eget, tincidunt ut justo. In tristique mi quis est fermentum, sed lobortis risus eleifend. Aenean eget tellus semper, iaculis metus vitae, faucibus ante. Nullam enim nibh, mattis at felis a, rhoncus accumsan mauris. Donec sit amet dignissim turpis, et egestas ex. Fusce varius tortor vel diam elementum sodales. Praesent vulputate semper dui, quis rhoncus erat porta eget. Nullam vel eros quis nibh hendrerit facilisis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In vel augue urna.\n\nNullam ligula diam, pulvinar nec leo non, placerat hendrerit nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis imperdiet dapibus vulputate. Sed ornare est elit, non consectetur arcu mollis non. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc sit amet est quis turpis rhoncus porttitor ac ac urna. Fusce iaculis ac tellus in consequat. Sed lobortis, neque vehicula finibus laoreet, justo arcu egestas diam, ac sollicitudin quam dui ut velit. Nam ullamcorper sodales sem id malesuada. Vivamus sed feugiat arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla id felis id arcu faucibus elementum viverra vitae mi. Sed facilisis, nisi eu mollis placerat, dolor sapien vestibulum sapien, egestas volutpat ligula enim at elit. In porta ante et massa cursus, in porta neque bibendum. Fusce nec sodales erat.',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000),
      },
      {
        id: '3',
        title:
          'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas',
        userId: '12',
        releaseId: '9',
        text: 'Nulla at tristique turpis, ut vehicula nisi. Aenean laoreet justo pretium gravida dignissim. Pellentesque vitae ante vulputate justo mattis dignissim. Duis feugiat, velit vitae facilisis maximus, dolor metus faucibus purus, at suscipit lorem arcu in risus. Sed mollis pretium mattis. Quisque eget facilisis lorem, malesuada porta felis. Maecenas ut nulla et nisl rhoncus interdum. Fusce efficitur enim quis massa vestibulum, eget pretium ligula faucibus. Quisque sed orci eget risus bibendum tempus sit amet non est. Pellentesque vitae dictum dolor. Morbi velit libero, blandit eu consequat id, commodo porttitor ipsum. Curabitur placerat, metus consequat tristique sagittis, nulla elit accumsan libero, quis venenatis erat lectus et enim. Nam ac ornare odio. Ut dictum eu leo et finibus.\n\nSed feugiat vehicula elementum. Donec a justo sit amet risus tincidunt mollis in a nunc. Nulla elementum quam sed magna iaculis ornare. Cras eu lorem elit. In pellentesque nisl vulputate, mattis elit id, auctor lacus. Nulla vehicula iaculis euismod. Donec ante mi, lobortis a ligula vel, ullamcorper scelerisque velit. Cras porttitor odio mauris, et pulvinar est dictum at. Morbi tellus ipsum, sagittis eget est vitae, posuere imperdiet massa.',
        createdAt: new Date(Date.now() - 15 * 3600 * 1000),
      },
      {
        id: '4',
        title: 'Aliquam tincidunt tempor felis et luctus.',
        userId: '13',
        releaseId: '8',
        text: 'Maecenas vel mauris eu urna posuere imperdiet. Nulla facilisi. Donec sit amet turpis leo. Proin ut viverra leo. Sed tincidunt enim sit amet tortor iaculis, at placerat urna dignissim. Cras tristique sollicitudin molestie. Fusce elementum placerat mollis. Quisque aliquam semper mattis. Nullam sodales gravida diam sed sagittis. Praesent blandit metus ac porttitor laoreet. Cras id sem volutpat, euismod nibh id, lobortis sapien. Vestibulum fringilla, risus eget tincidunt vehicula, nibh sapien tincidunt justo, in eleifend dui ante at dolor. Aliquam tincidunt tempor felis et luctus. Nulla facilisi. Nulla tristique mauris odio, vitae egestas metus dictum ac. Phasellus iaculis mi at velit tempor, ut suscipit diam mattis.Sed non posuere mauris. Donec congue consequat nunc, sit amet interdum purus pharetra eget. Curabitur purus erat, vehicula quis pharetra id, vehicula nec lorem. Suspendisse risus metus, pulvinar at magna et, malesuada egestas velit. Mauris dictum elit magna. Maecenas eu rutrum justo, vitae accumsan ipsum. Fusce rhoncus interdum lorem sed eleifend. Vestibulum ornare sagittis feugiat. Nullam eu odio quis justo suscipit sodales nec a elit. Morbi euismod est non elit rhoncus, in malesuada ante pulvinar. Duis orci dui, bibendum eu nisl at, lobortis molestie neque.',
        createdAt: new Date(Date.now() - 0 * 3600 * 1000),
      },
      {
        id: '5',
        title:
          'Suspendisse consectetur volutpat orci, vel aliquam dui mattis in.',
        userId: '13',
        releaseId: '10',
        text: 'Integer egestas enim eget pellentesque lobortis. Vestibulum vulputate odio velit, non rhoncus tellus vulputate a. Praesent fringilla iaculis arcu, a vulputate metus fermentum non. Sed commodo, lorem ac suscipit dapibus, sem velit eleifend sem, pulvinar laoreet urna urna at justo. Cras mi nisl, imperdiet id sollicitudin at, ornare sollicitudin dui. Fusce volutpat convallis placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac tempus quam. Suspendisse consectetur volutpat orci, vel aliquam dui mattis in. Ut sagittis congue velit a vulputate. In sed mollis tortor. Maecenas lacus elit, sollicitudin nec enim vitae, facilisis hendrerit urna. Sed id varius urna. Sed nulla tellus, malesuada vitae lacus sed, ullamcorper fermentum ipsum. Quisque tristique semper dui, sed ultrices velit euismod lacinia.\n\nVestibulum tincidunt nunc urna, nec pulvinar diam fermentum in. Fusce interdum finibus massa, nec iaculis ipsum ullamcorper eu. Etiam ornare sem sollicitudin erat porta, ac aliquam risus tempus. Quisque id dapibus dolor. Etiam vitae ex eget risus mattis ultricies. Suspendisse accumsan aliquam lacus eu lacinia. Suspendisse at dolor congue ipsum rutrum facilisis non sit amet nisl. Nullam eros ligula, luctus pharetra maximus at, egestas sed justo.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: '6',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        userId: '14',
        releaseId: 'release1',
        text: 'Pellentesque in orci pharetra, dictum ante vel, faucibus dui. Pellentesque vitae finibus tortor, ac convallis leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nec vehicula erat. Sed ut vestibulum augue, vel vulputate arcu. Mauris bibendum diam et luctus sagittis. Cras sollicitudin lacus non fermentum rhoncus.\n\nMorbi porttitor malesuada dictum. Proin euismod rhoncus neque et tempus. Quisque facilisis lectus sem, at pulvinar nisi egestas nec. Vivamus lobortis pharetra interdum. Quisque malesuada turpis eget convallis lacinia. Proin sed purus sed nibh placerat tempor. Sed malesuada felis vel purus accumsan porta. Fusce ultrices vestibulum rutrum. In et leo viverra, tincidunt diam quis, finibus purus. Sed luctus dapibus gravida. Mauris finibus est ultrices tellus aliquam imperdiet.',
        createdAt: new Date(Date.now() - 1 * 1800 * 1000),
      },
      {
        id: '7',
        title: 'Ut non suscipit augue.',
        userId: '15',
        releaseId: 'release3',
        text: 'Pellentesque auctor, metus eu lacinia iaculis, nisl arcu ornare mauris, vestibulum vehicula est nunc ut ipsum. Cras consectetur maximus bibendum. In suscipit sodales sem, vel pellentesque sem iaculis in. Vivamus imperdiet ex in sapien feugiat porta. Pellentesque laoreet feugiat enim vitae tristique. Pellentesque cursus neque eget quam iaculis molestie. Sed interdum, odio quis cursus molestie, felis magna luctus justo, id feugiat libero tortor a tortor. Donec semper, turpis quis vulputate tempus, purus tellus commodo enim, nec vestibulum ipsum ante id velit. Nullam et dolor et enim varius interdum. Donec sed urna odio. Sed nibh dolor, elementum non ullamcorper quis, vestibulum quis mi. Donec enim nulla, dictum a tempus ac, viverra non nunc. Nam id nisi at libero condimentum hendrerit eget ullamcorper ante.',
        createdAt: new Date(Date.now() - 3 * 1800 * 1000),
      },
      {
        id: '8',
        title: 'Praesent fermentum vulputate sem vitae ultrices.',
        userId: '16',
        releaseId: 'release3',
        text: 'Etiam euismod sed velit et pharetra. Integer lacus metus, dictum id bibendum ac, venenatis ac orci. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pellentesque varius lacinia. Vestibulum eu justo finibus, vehicula arcu et, feugiat lacus. Suspendisse efficitur finibus neque. Vestibulum in ligula feugiat, consequat urna vitae, auctor diam. Vivamus cursus, quam in euismod vestibulum, massa est suscipit nisl, sed sodales urna nulla et metus. Aenean ultricies non massa sit amet euismod. Quisque at egestas urna, nec fermentum ex. Morbi erat turpis, rutrum at dolor a, condimentum mollis lectus. Cras non ultricies justo. Aliquam sit amet condimentum ante.',
        createdAt: new Date(Date.now() - 2 * 1800 * 1000),
      },
      {
        id: '9',
        title: 'Proin rutrum mauris non euismod fringilla.',
        userId: '14',
        releaseId: 'release3',
        text: 'Aenean rhoncus eleifend vestibulum. Vestibulum facilisis rutrum lectus, tempus tincidunt neque congue sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam blandit scelerisque justo, nec fringilla erat eleifend ac. Sed congue mattis mauris sit amet commodo. Fusce id consequat est, id eleifend enim. Nunc semper nulla magna, quis ornare tellus facilisis efficitur. Vivamus varius interdum lectus vitae facilisis. Aliquam eget lectus ac lectus ornare vehicula. Proin eleifend aliquet nisi.',
        createdAt: new Date(Date.now() - 10 * 1800 * 1000),
      },
      {
        id: '10',
        title: 'Aenean vel quam eget est euismod tempor ut vel est.',
        userId: '14',
        releaseId: 'release5',
        text: 'Fusce lacus velit, tempor id dui eget, iaculis finibus tellus. Curabitur et euismod risus. Sed hendrerit massa id sem tristique, quis semper dolor fermentum. Phasellus eget ornare neque, ut mattis odio. Suspendisse consectetur dignissim nisl a commodo. Nam egestas, turpis ut suscipit sollicitudin, lacus tellus porta purus, quis pellentesque purus leo sed nisi. Nam facilisis eleifend efficitur. Quisque augue massa, tincidunt in justo quis, pulvinar condimentum nunc. Fusce quam mi, volutpat volutpat tristique sed, fringilla a risus. Vestibulum vulputate tempus arcu. Etiam efficitur ipsum et nibh posuere, ac fermentum velit sollicitudin. Pellentesque ut mi felis. Mauris tellus mauris, tincidunt nec ante vitae, ullamcorper auctor mauris. Pellentesque ultrices arcu eget ornare dictum.',
        createdAt: new Date(Date.now() - 1 * 1800 * 1000),
      },
    ],
  });

  await prisma.releaseRatingType.createMany({
    data: [
      {
        id: '1',
        type: ReleaseRatingTypesEnum.WITHOUT_TEXT,
      },
      {
        id: '2',
        type: ReleaseRatingTypesEnum.WITH_TEXT,
      },
      {
        id: '3',
        type: ReleaseRatingTypesEnum.MEDIA,
      },
    ],
  });

  await prisma.review.createMany({
    data: [
      // REVIEW 1
      {
        id: 'review-1-1',
        releaseId: 'release1',
        userId: '1',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Donec pellentesque eget elit euismod dignissim.',
        text: 'Donec velit nisi, vulputate vitae lacus id, ullamcorper molestie justo. Cras in ante mollis, scelerisque mauris volutpat, pharetra mi. Nulla posuere, lectus eu mollis cursus, lorem quam malesuada erat, nec pulvinar nulla tellus in ipsum. Nullam et auctor turpis, sit amet mollis massa. Fusce efficitur ultricies viverra. Aenean interdum lacus nec blandit faucibus. Donec non cursus eros, in efficitur nisl. Sed ut commodo elit. Vestibulum a dui ac lorem aliquet pellentesque et nec lacus. Nam varius laoreet tortor, eu pellentesque erat posuere a. Nunc justo nunc, finibus in magna eu, convallis eleifend augue.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: 'review-1-2',
        releaseId: 'release1',
        userId: '2',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 9,
        atmosphere: 10,
        total: 88,
        title:
          'Sed orci ligula, tincidunt a risus non, venenatis gravida sapien',
        text: 'Praesent elementum at risus non accumsan. Cras sit amet diam sem. Nulla eu magna dui. Ut rutrum, dolor vel mattis venenatis, odio ipsum maximus mauris, sit amet venenatis massa lacus sed eros. Maecenas efficitur tincidunt dui, non luctus ante tempor et. Nullam quis massa feugiat lorem faucibus ornare. Vivamus ac mi ut orci lacinia bibendum ac ut urna. In hac habitasse platea dictumst. Quisque commodo nisl nisi, eu condimentum mauris congue sit amet. Sed eu lacinia augue. Duis dapibus dapibus sollicitudin. In ut ex lectus. Aliquam id tincidunt diam. Donec pellentesque tempor lacus.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: 'review-1-3',
        releaseId: 'release1',
        userId: '3',
        rhymes: 7,
        structure: 7,
        realization: 8,
        individuality: 7,
        atmosphere: 8,
        total: 60,
        title:
          'Nulla arcu libero, dictum sed fermentum vitae, dapibus eget ante.',
        text: 'Pellentesque eu convallis arcu. Aenean velit arcu, scelerisque tempus cursus non, tincidunt sit amet mi. Phasellus semper erat a massa dapibus pharetra. Morbi dictum, mauris vel aliquet tincidunt, magna nisi pretium est, sit amet scelerisque nisi elit ut nunc. Pellentesque tempor luctus lacinia. In sed fermentum ligula. Donec sit amet tempus orci. Aenean vel viverra lorem, in posuere tortor. Praesent sollicitudin quam nec porta sagittis. Aenean viverra risus urna, eget feugiat mi ultrices nec. Phasellus non lorem a turpis efficitur imperdiet. Donec at mattis est, ac pellentesque lectus. Morbi vitae pretium diam.',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      },
      {
        id: 'review-1-4',
        releaseId: 'release1',
        userId: '4',
        rhymes: 10,
        structure: 9,
        realization: 9,
        individuality: 10,
        atmosphere: 10,
        total: 86,
        title:
          'Donec cursus mi ac dolor volutpat, in sollicitudin dolor lacinia.',
        text: 'Morbi rutrum quam et metus tincidunt, ut dignissim massa fringilla. Nullam venenatis luctus interdum. Morbi mattis condimentum urna, ut lacinia quam. Nunc ac arcu et orci placerat posuere. Mauris in scelerisque sapien. Phasellus velit turpis, lacinia eget lacus sed, semper mattis mauris. Suspendisse vitae eros eu eros euismod euismod et eget risus. Suspendisse purus ante, iaculis nec iaculis non, convallis eget justo. Praesent quis blandit velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        id: 'review-1-5',
        releaseId: 'release1',
        userId: '5',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title:
          'Sed scelerisque elit in lacus eleifend, at laoreet tortor convallis.',
        text: 'Mauris id varius purus. Duis a vulputate metus. Suspendisse vel nibh in nunc posuere dapibus. Integer gravida nisi accumsan enim vehicula, non condimentum purus fringilla. Vestibulum dictum pretium est. Cras interdum dignissim condimentum. Proin venenatis mauris nisl, sit amet ultricies nisl convallis eget. Proin vitae lorem at magna dignissim rutrum nec in turpis. In mollis quis velit eu laoreet. Ut sed mi aliquet, viverra augue et, mollis urna.',
        createdAt: new Date(Date.now() - 5 * 3600 * 1000),
      },
      {
        id: 'review-1-6',
        releaseId: 'release1',
        userId: '6',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title:
          'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        text: 'Donec ut cursus risus. Nullam quis metus nec libero ornare ullamcorper at non tortor. Vestibulum mollis lacinia felis, convallis dictum justo. Donec sit amet congue quam. Nam luctus tortor id neque sodales suscipit. Phasellus blandit lorem semper, dapibus velit accumsan, elementum mauris. Vivamus id justo vehicula, malesuada ipsum quis, porta tortor. Donec nec finibus leo. Donec ut erat vitae mi ultrices interdum vel ac ligula. In pellentesque mollis imperdiet. Etiam porta suscipit nunc eu tempor. Mauris a elementum tellus.',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        id: 'review-1-7',
        releaseId: 'release1',
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
        id: 'review-1-8',
        releaseId: 'release1',
        userId: '8',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Nulla sed dolor egestas, pharetra sapien non, placerat magna.',
        text: 'Mauris rutrum vestibulum laoreet. Morbi scelerisque eros quis nulla ultricies convallis. Sed id molestie felis. Praesent commodo, odio scelerisque bibendum rhoncus, arcu dui pretium libero, dictum vulputate arcu arcu ac metus. Sed sit amet dapibus lorem, ac pellentesque est. Phasellus at velit in metus consequat suscipit. Maecenas porta nibh urna, faucibus aliquam ligula consequat id. Vestibulum feugiat pellentesque elit in sagittis. Praesent sed justo suscipit, blandit nisi vel, placerat ex.',
        createdAt: new Date(Date.now() - 26 * 3600 * 1000),
      },
      {
        id: 'review-1-9',
        releaseId: 'release1',
        userId: '9',
        rhymes: 10,
        structure: 9,
        realization: 10,
        individuality: 8,
        atmosphere: 10,
        total: 83,
        title: 'Nunc quis sapien non risus fermentum viverra.',
        text: 'Vivamus quis urna quis odio vehicula convallis vitae et velit. Nunc sollicitudin convallis quam, ac condimentum lacus fringilla sit amet. Pellentesque a nulla orci. Integer lobortis efficitur imperdiet. Aliquam ultrices, elit ut mattis mattis, ante libero accumsan nisi, et ornare nulla turpis sed urna. Integer finibus diam mi, sit amet placerat nulla tristique sit amet. Curabitur maximus auctor egestas. Donec in enim vitae velit efficitur sollicitudin a ac justo. Aenean convallis efficitur iaculis.',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000),
      },
      {
        id: 'review-1-10',
        releaseId: 'release1',
        userId: '10',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 81,
        title:
          'Duis lacus massa, accumsan a ullamcorper quis, finibus aliquet justo.',
        text: 'Pellentesque pharetra magna at hendrerit cursus. Donec pulvinar erat orci. Integer ac congue erat. Sed at gravida nisi. Donec orci orci, commodo eu nisi at, tincidunt gravida enim. Sed non porta magna, at pellentesque ligula. In ut elementum libero. Maecenas hendrerit pretium lectus a placerat. Integer et dolor ac ex facilisis semper ut non justo. In a ligula diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi auctor pretium leo sit amet tristique. Aliquam est neque, dictum et ex eu, scelerisque commodo libero. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque sit amet enim ullamcorper enim bibendum aliquet.',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000),
      },

      // REVIEW 2
      {
        id: 'review-2-1',
        releaseId: 'release2',
        userId: '1',
        rhymes: 8,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 79,
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        text: 'Aenean a diam et purus faucibus condimentum. Praesent consectetur malesuada magna, ac aliquam sem pellentesque vitae. Phasellus imperdiet porta rutrum. Proin nunc enim, pellentesque sed lacinia vitae, sollicitudin at elit. Vivamus eget metus venenatis lacus porttitor egestas. Nulla facilisi. Vivamus mattis quam a dui finibus, in tincidunt leo fringilla. Aliquam vel nulla in neque vulputate condimentum. Nunc dui leo, congue et quam id, tristique semper magna. Cras ornare metus a dolor scelerisque scelerisque. Fusce posuere consectetur felis et semper. Vestibulum orci lectus, interdum sit amet nibh ac, dictum interdum ante. Mauris bibendum magna ac odio feugiat dapibus ac eget justo. Curabitur lobortis leo felis.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: 'review-2-2',
        releaseId: 'release2',
        userId: '2',
        rhymes: 9,
        structure: 10,
        realization: 9,
        individuality: 8,
        atmosphere: 10,
        total: 81,
        title: 'Mauris quis imperdiet mauris, sed accumsan sapien.',
        text: 'Quisque feugiat risus vitae augue suscipit ultrices. Morbi vulputate augue turpis, eu tempor ex porttitor id. Nullam molestie, ante quis rhoncus venenatis, lectus enim elementum turpis, eget ultrices massa mauris a dui. Donec varius nulla et ligula gravida ultricies. Fusce egestas libero vel diam scelerisque aliquet. Cras dignissim libero ac urna venenatis euismod. Duis augue tellus, tempus in ullamcorper ac, placerat vitae velit. Duis molestie vel lacus ac pharetra. Etiam sapien felis, tempor vel ultricies eu, hendrerit vel ante. Donec interdum, enim a gravida consequat, odio metus dignissim ex, eget tincidunt justo sem ac metus. Quisque id orci nec metus fermentum fringilla in et nunc. Sed sed felis risus. Etiam non augue diam.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: 'review-2-3',
        releaseId: 'release2',
        userId: '3',
        rhymes: 5,
        structure: 5,
        realization: 5,
        individuality: 5,
        atmosphere: 1,
        total: 28,
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: 'review-2-4',
        releaseId: 'release2',
        userId: '4',
        rhymes: 9,
        structure: 10,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 83,
        title:
          'Praesent ultricies nisi sit amet risus ultrices, a ultricies leo vulputate.',
        text: 'Aliquam vitae ultrices tortor, at porta lacus. Cras id sem auctor magna gravida faucibus sit amet ut lorem. Suspendisse ultricies dui quis imperdiet viverra. Curabitur ac massa odio. Quisque a mauris ut massa scelerisque bibendum facilisis rutrum ante. Pellentesque ut magna eget massa dictum dapibus. Quisque porttitor sapien nec maximus imperdiet. Integer quam tortor, pretium vitae volutpat vitae, viverra non ipsum. Ut tincidunt sodales elit sed gravida. Phasellus eu sapien consectetur, porta lectus nec, sagittis dolor. Suspendisse potenti. Donec ullamcorper eleifend ante, nec mattis tortor ultrices non. Morbi nec felis magna. Nullam vitae scelerisque augue, quis porttitor tellus.',
        createdAt: new Date(Date.now() - 32 * 3600 * 1000),
      },
      {
        id: 'review-2-5',
        releaseId: 'release2',
        userId: '5',
        rhymes: 10,
        structure: 8,
        realization: 9,
        individuality: 8,
        atmosphere: 10,
        total: 79,
        title:
          'Maecenas ultricies tortor nec lorem volutpat, quis rhoncus risus maximus.',
        text: 'Morbi fringilla sem eget magna imperdiet pretium. Sed vel enim in tortor porta scelerisque vitae faucibus urna. Praesent rhoncus magna a massa fringilla, ut placerat ipsum efficitur. Sed eget magna vitae turpis placerat placerat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent vitae magna massa. Mauris iaculis nisi vitae mauris auctor blandit non quis enim. Aenean ac nibh quis massa rutrum gravida et sed diam. Donec eu efficitur augue. Quisque eget quam commodo velit accumsan pulvinar. Mauris dolor lacus, commodo at semper eget, rutrum non ex.',
        createdAt: new Date(Date.now() - 32 * 3600 * 1000),
      },
      {
        id: 'review-2-6',
        releaseId: 'release2',
        userId: '6',
        rhymes: 9,
        structure: 9,
        realization: 8,
        individuality: 8,
        atmosphere: 10,
        total: 77,
        createdAt: new Date(Date.now() - 32 * 3600 * 1000),
      },

      // REVIEW 3
      {
        id: 'review-3-1',
        releaseId: 'release3',
        userId: '1',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 9,
        total: 78,
        createdAt: new Date(Date.now() - 27 * 3600 * 1000),
      },
      {
        id: 'review-3-2',
        releaseId: 'release3',
        userId: '2',
        rhymes: 8,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 8,
        total: 72,
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        text: 'Morbi suscipit tempus malesuada. Cras tortor tellus, finibus nec mattis in, gravida sed dolor. Proin et magna ipsum. Nulla molestie suscipit sem eget porttitor. Nunc imperdiet nulla velit, eu laoreet metus semper tempus. Donec placerat nunc a scelerisque vulputate. Duis fermentum et risus eu lobortis. In sagittis massa maximus convallis vestibulum. Morbi vulputate ac metus in convallis. Donec a felis pretium nunc placerat aliquam. Donec euismod, purus a fermentum fermentum, ante dui tincidunt magna, at tincidunt est diam non purus. Integer condimentum velit enim, ac feugiat purus condimentum non. Integer tempus vestibulum velit at porttitor. Integer feugiat a dolor nec congue.',
        createdAt: new Date(Date.now() - 58 * 3600 * 1000),
      },
      {
        id: 'review-3-3',
        releaseId: 'release3',
        userId: '3',
        rhymes: 10,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 83,
        title: 'Vestibulum sit amet augue nunc.',
        text: 'Sed scelerisque volutpat fringilla. In elementum erat sit amet rutrum malesuada. Duis aliquet velit congue nibh suscipit, ut pulvinar lacus dapibus. Duis vulputate nisi eu turpis dignissim, at tincidunt nisi iaculis. Praesent sit amet elit in diam dapibus blandit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla et nulla at lectus mattis pellentesque. Sed egestas augue eu bibendum bibendum. Morbi a elit consequat, commodo justo vitae, pretium libero. Integer in elementum nisi. Phasellus interdum ipsum id massa sollicitudin pharetra. Sed libero felis, rhoncus eu cursus nec, interdum et sapien. Suspendisse non egestas sem. Curabitur sollicitudin pulvinar leo id rutrum. In at dapibus lorem.',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      },
      {
        id: 'review-3-4',
        releaseId: 'release3',
        userId: '10',
        rhymes: 10,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 83,
        createdAt: new Date(Date.now() - 5 * 3600 * 1000),
      },

      // REVIEW 4
      {
        id: 'review-4-1',
        releaseId: 'release4',
        userId: '1',
        rhymes: 8,
        structure: 9,
        realization: 8,
        individuality: 9,
        atmosphere: 10,
        total: 77,
        title: 'In tempor ac sapien eget vehicula.',
        text: 'Suspendisse potenti. Praesent sed mi magna. Aliquam vestibulum blandit risus, vel placerat est pellentesque et. Quisque volutpat eget nibh a interdum. Donec lobortis tempor dignissim. In laoreet magna sit amet risus pretium efficitur. Fusce vitae tempus dui. Nunc molestie, mi vitae mattis tempor, massa tortor blandit tortor, at dapibus nibh sem quis nisl. Sed vitae fringilla purus. Integer egestas tellus at lacus viverra tincidunt.',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        id: 'review-4-2',
        releaseId: 'release4',
        userId: '2',
        rhymes: 10,
        structure: 9,
        realization: 9,
        individuality: 10,
        atmosphere: 10,
        total: 86,
        createdAt: new Date(Date.now() - 5 * 3600 * 1000),
      },
      {
        id: 'review-4-3',
        releaseId: 'release4',
        userId: '5',
        rhymes: 10,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 83,
        title:
          'Nullam sed dolor sit amet lectus auctor eleifend pharetra vel enim.',
        text: 'Suspendisse potenti. Nunc posuere congue est. Duis in elit vel diam ultricies tristique nec id massa. In augue metus, dictum in euismod in, mollis non magna. Etiam tincidunt, tortor in volutpat facilisis, mauris metus molestie tellus, a efficitur arcu quam elementum nulla. Donec molestie id sem id tincidunt. Integer ac ornare quam. Vivamus fringilla feugiat aliquet. Cras sollicitudin hendrerit sapien in elementum. Nunc cursus lobortis odio.\n\nNulla ornare felis non elit scelerisque posuere. Duis dignissim neque vel tincidunt condimentum. Suspendisse congue, sem vitae porta mattis, sapien neque fermentum leo, nec mattis dolor metus a nunc. Proin non arcu massa. Maecenas ullamcorper, ante id tincidunt vehicula, lacus nulla tincidunt tortor, eu sollicitudin nulla sem quis leo. Vestibulum et nisl odio. Mauris vitae nibh gravida lorem rhoncus vehicula. In hac habitasse platea dictumst.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: 'review-4-4',
        releaseId: 'release4',
        userId: '8',
        rhymes: 9,
        structure: 8,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 79,
        createdAt: new Date(Date.now() - 11 * 3600 * 1000),
      },
      {
        id: 'review-4-5',
        releaseId: 'release4',
        userId: '10',
        rhymes: 8,
        structure: 10,
        realization: 9,
        individuality: 10,
        atmosphere: 10,
        total: 83,
        title: 'Nullam vitae eros nec lectus porta molestie eu sed ipsum.',
        text: 'Duis felis massa, ultricies non luctus quis, rutrum eget leo. Maecenas ac hendrerit risus. Nam ligula elit, blandit aliquet lectus quis, pretium porttitor velit. Vivamus pulvinar lacus justo, et ultricies felis blandit vitae. Aliquam porta, elit fermentum sollicitudin suscipit, justo arcu scelerisque magna, vel luctus augue diam a mi. Ut ac purus a libero malesuada semper quis vel felis. Morbi finibus orci nibh, dictum vulputate nibh tincidunt sed. Quisque tristique condimentum feugiat. Vivamus non semper diam. Sed lacinia finibus tristique. Proin nec nisl sit amet enim condimentum vulputate in pellentesque sem. Sed non mauris in arcu egestas efficitur eget sed turpis. Cras venenatis in felis tempus facilisis.',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000),
      },

      // REVIEW 5
      {
        id: 'review-5-1',
        releaseId: 'release5',
        userId: '1',
        rhymes: 9,
        structure: 8,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 79,
        title: 'Ut et metus convallis, facilisis risus ut, imperdiet enim.',
        text: 'Ut tristique vitae augue eu cursus. Mauris sit amet augue arcu. Aliquam congue fermentum neque, rutrum porta lacus semper in. Vestibulum dapibus iaculis dolor. Suspendisse potenti. Nam ac convallis enim. Mauris vitae purus non erat auctor ultrices. Phasellus risus turpis, venenatis sit amet magna eu, gravida gravida lacus. Duis feugiat tristique sem in egestas. Mauris sagittis sodales turpis sed euismod. Praesent eu leo sodales, posuere enim quis, hendrerit augue. Ut at risus a leo accumsan vehicula. Proin egestas, libero vitae fringilla viverra, nisl mi vestibulum neque, ornare lacinia quam ante dictum leo. Aliquam semper venenatis nisi a placerat.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: 'review-5-2',
        releaseId: 'release5',
        userId: '2',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 81,
        title: 'Etiam id fringilla ex. Sed feugiat quis nulla eu sollicitudin.',
        text: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris viverra odio in sapien pulvinar semper. Nunc sed tellus vitae massa accumsan bibendum ut at eros. Curabitur dictum nisi non molestie fermentum. Duis pharetra porta quam in semper. Nam aliquet, odio feugiat porta sagittis, nisi augue elementum diam, eget varius augue est nec neque. Praesent sem turpis, luctus in metus a, tincidunt vehicula felis. Aenean dictum euismod nisl sed tincidunt. Sed rutrum, tellus vel varius finibus, elit elit eleifend nisl, vitae congue ex lacus sed magna. Nam vulputate sed nisi blandit pretium.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
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
        title: 'Donec commodo vel ipsum ac commodo.',
        text: 'Morbi venenatis mi sed massa semper, tempus pharetra odio vulputate. Cras tincidunt nunc erat, sit amet porttitor felis mollis dapibus. Vivamus erat massa, cursus id ligula id, iaculis gravida quam. Nam pharetra lectus quis ex vestibulum sagittis. Suspendisse dapibus consequat tristique. Ut gravida elementum justo, rutrum efficitur ante dignissim vitae. In vitae leo posuere, varius leo quis, tempus orci. Maecenas eget velit at nulla tempus aliquet. Nam id elit vehicula, interdum leo ut, ornare est. Curabitur vitae lectus non ante vulputate posuere vel fringilla nisl. Nulla fermentum hendrerit nunc, eget imperdiet nibh tincidunt vitae.',
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
        title: 'Fusce metus arcu, tempus in mollis sed, eleifend eget massa.',
        text: 'Suspendisse accumsan mauris diam, a fringilla nisi pretium eget. Cras leo nulla, pretium in volutpat sed, iaculis sed nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque consectetur purus a elit auctor tempor. Cras tempus est eget erat gravida, sit amet tempus sapien semper. Etiam vitae magna purus. Aenean quis tellus lobortis, lacinia mauris eu, fringilla purus. Vivamus tempor neque eu tortor pellentesque vestibulum. Nulla vestibulum ut ex nec iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent feugiat libero sit amet viverra pulvinar.',
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
        title: 'Donec ultrices massa enim, non scelerisque augue placerat ut.',
        text: 'Donec quis enim vitae risus feugiat luctus quis congue metus. Suspendisse suscipit mauris quis nisi volutpat dignissim. Ut et lobortis lorem. Nulla non nisl sagittis, imperdiet diam sed, viverra nisl. Curabitur viverra lorem sed est maximus, vel blandit sem ullamcorper. Pellentesque rutrum mi ut ligula elementum rutrum. Duis at felis sollicitudin est malesuada pulvinar. Proin hendrerit felis quis ipsum vulputate, nec venenatis ipsum volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus maximus ex id ipsum mollis pharetra. Morbi vestibulum, ipsum eu pretium ullamcorper, dolor dolor mollis massa, nec feugiat justo erat ac orci. Aliquam non metus congue, laoreet enim quis, viverra ex. Morbi eget ullamcorper risus.',
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
        title:
          'Suspendisse dapibus faucibus ex, at malesuada nibh scelerisque sit amet.',
        text: 'Integer tempor neque eget erat pellentesque malesuada. Suspendisse potenti. Suspendisse potenti. Integer sodales pulvinar sapien. Donec dictum sollicitudin erat a fermentum. In vel fermentum quam. Aenean a risus ac lectus gravida egestas. Nulla sed purus eu nulla aliquam feugiat a at ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed lorem neque, gravida eu tempus ut, mattis a urna. Nulla facilisi. Cras convallis rutrum enim eu maximus. Integer a massa ullamcorper dui lacinia sodales nec quis justo. In cursus enim vel felis laoreet, at mattis lectus posuere. Mauris sed dignissim odio, at varius eros. Sed pellentesque blandit tincidunt.',
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
        title: 'Integer tempor neque eget erat pellentesque malesuada.',
        text: 'Nullam commodo, elit et sodales tincidunt, dui odio pretium erat, sit amet semper lectus nunc nec velit. Aenean ac fermentum tortor. Duis congue placerat neque, ut egestas justo aliquam ut. Maecenas vel tincidunt urna. Cras ut magna metus. Duis at lacus vel mauris semper sagittis. Donec vitae vulputate eros. In varius nunc tempus consectetur dictum. Nam sit amet mi at ipsum porta iaculis. Sed lobortis dui sit amet nisi auctor pretium. Etiam imperdiet nisl posuere nulla commodo porta. Nam lobortis dictum vehicula. Donec et lacus in ex feugiat auctor.',
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
        title:
          'Pellentesque eget tortor at nisi commodo hendrerit ut et tortor.',
        text: 'Cras at efficitur lectus. Proin at fringilla sem, non gravida elit. Ut sagittis, tortor a rutrum malesuada, leo arcu maximus neque, convallis iaculis mauris risus eget sem. Proin sed augue vel elit elementum sodales id nec eros. Suspendisse dictum et mauris quis efficitur. Suspendisse dapibus risus ex, ac malesuada lectus gravida at. Phasellus mollis, mauris sit amet placerat rhoncus, turpis mauris egestas arcu, in laoreet nisi urna in purus. Donec molestie aliquam lobortis. Nunc non nulla vitae nunc ultricies ornare a a metus. Suspendisse id enim lacinia, lobortis leo eu, condimentum tortor. Mauris feugiat mi at dolor venenatis vehicula. Proin eu semper metus. Phasellus massa diam, varius non convallis non, varius vitae magna. Nam finibus sit amet erat a tristique.',
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
        title: 'Donec finibus congue felis eu pretium. ',
        text: 'Suspendisse auctor porta nisl, vitae imperdiet ex gravida varius. Aenean venenatis purus id dolor semper tempor. Maecenas sit amet augue sem. Curabitur sed magna rutrum, aliquet metus sed, eleifend ex. Praesent odio leo, finibus ac lobortis non, interdum a tortor. Cras magna turpis, gravida id porta et, porta in orci. Cras iaculis consectetur commodo. Donec quis nunc ac velit dictum pellentesque. Suspendisse nulla sapien, laoreet ac condimentum ac, dictum a odio. Integer eget purus nunc. Aliquam a risus porttitor, tincidunt nunc at, aliquam nunc. Vivamus semper, odio eget dictum pulvinar, lacus tellus vestibulum nisl, et facilisis magna sapien in orci. Curabitur ante orci, dignissim et vulputate quis, bibendum et neque. Aliquam condimentum sed ex vitae luctus.',
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
        title:
          'Donec accumsan libero ut risus sodales, at congue lorem euismod.',
        text: 'Vivamus mollis condimentum dui, sed malesuada felis elementum et. Donec id orci diam. Aenean mollis enim tellus, quis consequat lorem tempor id. Sed non scelerisque libero. Sed congue dolor at risus tincidunt egestas. Curabitur placerat lobortis urna scelerisque dapibus. Ut porttitor ornare finibus. Sed erat leo, consequat sit amet eleifend et, mollis in turpis. Donec tristique ante dolor, sit amet iaculis erat placerat id. In gravida lectus orci, ut venenatis risus tristique molestie. Quisque eu nisl ac elit accumsan auctor. Donec orci ante, gravida eu nunc a, pellentesque venenatis nunc.\n\nCurabitur eu accumsan metus. Nullam eleifend condimentum turpis id sodales. Maecenas rhoncus, arcu sit amet aliquam bibendum, libero sapien posuere arcu, ac condimentum libero eros non justo. Proin sed lectus dolor. Fusce at metus nec tortor lobortis molestie. Cras ut eleifend lacus. Cras accumsan enim sed pharetra ultricies.',
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
        title: 'Etiam tempor justo vitae mauris sollicitudin lacinia.',
        text: 'Mauris pulvinar tempor hendrerit. Suspendisse potenti. Vivamus consequat tellus enim, eu mattis diam viverra eget. Aliquam erat volutpat. Vivamus nec purus vitae ligula feugiat commodo at quis sapien. Donec sodales risus eu ex tempor fringilla ut in nisl. Praesent posuere semper leo, a aliquet elit malesuada ut. Nam est sapien, condimentum eget quam non, interdum pharetra ipsum. In eu fringilla elit, id molestie sem. Nam maximus, leo in dignissim ullamcorper, lorem velit suscipit ipsum, eu rutrum metus purus nec tortor. Curabitur sodales auctor eros et pharetra. Quisque ac ullamcorper nibh. Morbi feugiat, sem nec facilisis malesuada, lorem nisi egestas neque, et porta nisl nisi nec lectus. Maecenas vitae purus at erat ultrices lacinia.',
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
        title: 'Donec at eros id arcu maximus ultrices.',
        text: 'Vestibulum tincidunt sodales felis, eget fermentum tortor condimentum maximus. Proin placerat arcu sed augue porta, vitae lacinia nulla suscipit. Fusce varius consequat ex sit amet dapibus. Sed scelerisque ipsum quis leo molestie ullamcorper. Mauris ut ipsum justo. Ut malesuada eleifend enim, ut euismod sapien varius vel. Integer pharetra nisl interdum nisl ornare, vel hendrerit purus pulvinar. Vestibulum sit amet libero in arcu scelerisque rutrum eu quis quam. Nulla facilisi. Suspendisse urna magna, commodo et commodo non, vulputate eget dui. Phasellus diam erat, pharetra elementum arcu varius, lacinia finibus sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam lacus, iaculis sit amet lectus sit amet, tempor scelerisque sapien. Maecenas nec porta turpis, quis vestibulum libero. Aenean rutrum velit sit amet gravida hendrerit.',
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
        title: 'Etiam id lobortis mauris, id consectetur mauris.',
        text: 'Sed blandit, augue at vulputate dignissim, ligula velit efficitur sem, id suscipit felis diam vitae eros. Donec aliquam est non ex suscipit sagittis. In in erat posuere, faucibus nulla nec, pellentesque urna. Morbi ut lacus rutrum quam dapibus laoreet. Maecenas sit amet ultricies magna, id egestas dolor. Curabitur sit amet mollis nisi, vel tincidunt purus. Fusce sed massa tincidunt, cursus orci ac, auctor est. Fusce a leo et eros commodo blandit. Maecenas placerat justo ac dolor luctus maximus. Praesent dictum mi eu mi eleifend tempor. Mauris sit amet erat in dui pulvinar gravida. Sed ut purus sit amet ligula fringilla ultrices. Suspendisse quis posuere odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
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
        title:
          'Praesent ullamcorper nibh eu nunc hendrerit, a auctor tortor varius.',
        text: 'Curabitur eleifend purus sit amet vehicula accumsan. Duis non viverra nisi. In iaculis eleifend arcu vel dictum. Ut dignissim ut purus sit amet congue. Nam at dictum odio. Aliquam euismod volutpat nulla, sed malesuada odio. Morbi finibus elit sit amet bibendum sollicitudin. Mauris elit purus, lobortis id rutrum ut, sollicitudin sit amet nisl. Proin vitae tempus lectus. Mauris rutrum magna vel mi consequat facilisis. Curabitur scelerisque, nunc non tincidunt elementum, ante massa vestibulum nisl, a interdum eros erat sit amet lorem. Cras vehicula fermentum risus sit amet lobortis.',
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
        title: 'Nam ac risus venenatis diam facilisis hendrerit et nec eros.',
        text: 'Integer blandit nibh in tortor sollicitudin bibendum. Nulla id diam eget sapien congue pulvinar. Curabitur eu purus rutrum, vehicula urna sed, congue purus. Aenean sapien nunc, condimentum sed ligula ac, tempor finibus neque. Praesent eget egestas lacus, eu vehicula eros. Nunc lectus magna, sollicitudin ut dapibus eu, scelerisque nec lacus. Donec finibus tellus nibh, eu lacinia nulla facilisis eget. Etiam at condimentum felis. Ut at vulputate ligula.\n\nVestibulum quis luctus magna. Nullam a est nec sapien elementum tincidunt. Sed tincidunt faucibus purus, vitae congue tellus egestas vitae. Proin eget augue justo. Aliquam ut nulla vitae nisi bibendum viverra vitae vel leo. Donec id hendrerit sem. Nam lorem dui, molestie eget purus sit amet, pharetra gravida enim. Ut commodo eget felis eu lacinia. Suspendisse pulvinar nunc nec leo volutpat vehicula. Morbi tempor felis in scelerisque facilisis. Integer ut ipsum sed mi rhoncus mollis.',
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
        title: 'Aliquam erat volutpat. Morbi ultrices pellentesque eros.',
        text: 'Ut gravida pretium eros non malesuada. Duis blandit viverra cursus. Quisque consectetur iaculis mattis. Etiam fringilla, erat vitae malesuada egestas, ex nulla ornare sapien, quis accumsan enim odio vitae erat. Nam tempus suscipit vestibulum. Nulla sagittis iaculis malesuada. Donec vel nulla et neque maximus vehicula. Sed suscipit quam sit amet commodo euismod. Vivamus vitae odio dictum, fringilla leo ut, lobortis arcu. In a maximus purus. Phasellus in quam mi. Phasellus ut odio magna. Quisque nec metus nulla. Fusce euismod ut dolor sit amet elementum.',
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
        title: 'Etiam facilisis at neque nec feugiat.',
        text: 'Morbi ultricies risus facilisis, tincidunt ipsum vitae, malesuada lectus. Nulla in diam magna. Sed lorem nibh, consectetur quis mollis sit amet, efficitur a est. In vitae purus dui. Aenean in pellentesque enim. Proin efficitur aliquet vestibulum. Quisque ultricies justo et metus posuere, sit amet volutpat sem imperdiet. Cras accumsan convallis nibh, id semper erat lacinia ac. Mauris faucibus, turpis vel volutpat sollicitudin, turpis velit imperdiet arcu, quis aliquam dui libero ut arcu. Nullam non iaculis arcu. Nam malesuada lorem est, ac malesuada magna dignissim et.\n\nQuisque eget neque vel est iaculis feugiat a quis ex. Maecenas ut condimentum urna. Donec non libero quam. Duis vel dui euismod, vestibulum enim ut, ultricies augue. Aliquam commodo tellus a dignissim lacinia. Ut vitae cursus lorem, a fringilla erat. Vivamus pretium elit dictum, pretium libero in, faucibus metus.',
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
        reviewId: '27',
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
        reviewId: '22',
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
        reviewId: '15',
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
        reviewId: '38',
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
        reviewId: '41',
        releaseMediaTypeId: '0',
        releaseMediaStatusId: '1',
        userId: '1',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        id: '6',
        title: 'КРИСПИ - DEEP INSIDE | Реакция и разбор',
        url: 'https://www.youtube.com/watch?v=on-bi3NmdaU',
        releaseId: 'release1',
        reviewId: 'review-1-1',
        releaseMediaTypeId: '0',
        releaseMediaStatusId: '1',
        userId: '1',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        id: '7',
        title: 'КРИСПИ - спи, не беспокойся (Official music video)',
        url: 'https://www.youtube.com/watch?v=3xSylhgPRUk',
        releaseId: 'release1',
        releaseMediaTypeId: '1',
        releaseMediaStatusId: '1',
        createdAt: new Date(Date.now() - 8 * 3600 * 1000),
      },
      {
        id: '8',
        title: 'КРИСПИ - 4 Стены | Реакция и разбор',
        url: 'https://www.youtube.com/watch?v=x4O758-IRKs',
        releaseId: 'release3',
        reviewId: 'review-3-1',
        releaseMediaTypeId: '0',
        releaseMediaStatusId: '1',
        userId: '1',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: '9',
        title: 'КРИСПИ - Психолог | Реакция и разбор',
        url: 'https://www.youtube.com/watch?v=ea_5hwrvfNE',
        releaseId: 'release4',
        reviewId: 'review-4-1',
        releaseMediaTypeId: '0',
        releaseMediaStatusId: '1',
        userId: '1',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
    ],
  });

  await prisma.userFavRelease.createMany({
    data: [
      // ------------------------------- 1
      {
        releaseId: 'release1',
        userId: '1',
      },
      {
        releaseId: 'release1',
        userId: '2',
      },
      {
        releaseId: 'release1',
        userId: '4',
      },

      // ------------------------------- 2
      {
        releaseId: 'release2',
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
      // Release 1
      {
        reviewId: 'review-1-1',
        userId: '14',
      },
      {
        reviewId: 'review-1-1',
        userId: '2',
      },
      {
        reviewId: 'review-1-1',
        userId: '3',
      },
      {
        reviewId: 'review-1-2',
        userId: '14',
      },
      {
        reviewId: 'review-1-2',
        userId: '4',
      },
      {
        reviewId: 'review-1-2',
        userId: '5',
      },
      {
        reviewId: 'review-1-3',
        userId: '14',
      },
      {
        reviewId: 'review-1-9',
        userId: '14',
      },
      {
        reviewId: 'review-1-10',
        userId: '14',
      },

      // Release 2
      {
        reviewId: 'review-2-1',
        userId: '14',
      },
      {
        reviewId: 'review-2-2',
        userId: '14',
      },
      {
        reviewId: 'review-2-4',
        userId: '14',
      },

      // RELEASE 3
      {
        reviewId: 'review-3-2',
        userId: '14',
      },
      {
        reviewId: 'review-3-3',
        userId: '14',
      },
      {
        reviewId: 'review-3-2',
        userId: '15',
      },
      {
        reviewId: 'review-3-3',
        userId: '15',
      },
      {
        reviewId: 'review-3-3',
        userId: '16',
      },

      // RELEASE 3
      {
        reviewId: 'review-4-1',
        userId: '2',
      },
      {
        reviewId: 'review-4-1',
        userId: '3',
      },
      {
        reviewId: 'review-4-1',
        userId: '4',
      },
      {
        reviewId: 'review-4-3',
        userId: '1',
      },
      {
        reviewId: 'review-4-5',
        userId: '1',
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

  await prisma.userFavMedia.createMany({
    data: [
      {
        userId: '2',
        mediaId: '6',
      },
      {
        userId: '3',
        mediaId: '6',
      },
      {
        userId: '14',
        mediaId: '6',
      },
      {
        userId: '2',
        mediaId: '7',
      },
      {
        userId: '3',
        mediaId: '7',
      },
      {
        userId: '4',
        mediaId: '7',
      },
      {
        userId: '5',
        mediaId: '7',
      },
      {
        userId: '3',
        mediaId: '8',
      },
      {
        userId: '14',
        mediaId: '8',
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
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
