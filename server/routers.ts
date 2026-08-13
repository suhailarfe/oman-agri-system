import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // نظام مناطق عُمان الزراعية ومؤشرات الأمن الغذائي
  agri: router({
    getRegions: publicProcedure.query(async () => {
      return [
        {
          code: "najd",
          number: "01",
          name: "النجد — ظفار",
          area: "40,000 كم² (~80% من ظفار)",
          crop: "قمح استراتيجي، نخيل، أعلاف، ولبان",
          water: "خزان جوفي ضخم + تحلية شمسية للطاقة المتجددة",
          description: "بوابة الاكتفاء الذاتي الزراعي للسلطنة. تتميز بخصوبة الأراضي ووفرة مياه الخزان الجوفي، وأثبتت نجاحاً استثنائياً في زراعة القمح واللبان والبطيخ.",
          details: "تعتبر النجد الشريان الأبرز لإنتاج الحبوب في سلطنة عُمان. تشمل خطط التنمية استصلاح آلاف الهكتارات وفق أنظمة ري محورات ذكية تقلل الفاقد المائي بنسبة تتجاوز 45%.",
          metrics: { investment: "120 ألف ر.ع", capacity: "10,000 هكتار المرحلة الأولى", sustainability: "92%" },
          supervisor: "م. سالم المعشني",
          status: "مستغل جزئياً / توسع مستهدف 2040"
        },
        {
          code: "batinah",
          number: "02",
          name: "سهل الباطنة",
          area: "الشريط الساحلي الشمالي الخصب",
          crop: "خضروات طازجة (طماطم، خيار)، حمضيات، ومانجو",
          water: "معالجة مياه الصرف الصحي + حصاد السدود",
          description: "تاريخ عريق في الزراعة والخصوبة الساحلية. رغم تحديات تملح المياه، يجري إعادة تأهيل السهل عبر استنبات محاصيل متحملة للملوحة واستخدام المياه المعالجة متقدمة النقاء.",
          details: "يغطي السهل الأسواق المحلية بأجود أنواع الحمضيات والخضروات، مدعوماً بشبكة نقل سريعة ومزارع محمية حديثة.",
          metrics: { investment: "95 ألف ر.ع", capacity: "6,500 هكتار", sustainability: "85%" },
          supervisor: "د. فاطمة البلوشي",
          status: "نشط / إعادة تأهيل مائي"
        },
        {
          code: "dhahirah",
          number: "03",
          name: "محافظة الظاهرة",
          area: "امتداد صحراوي شاسع ذو تربة رملية مواتية",
          crop: "نخيل فاخر، محاصيل حقلية جافة، ونباتات طبية",
          water: "زراعة مائية (Hydroponics) وبيوت محمية ذكية",
          description: "بيئة صحراوية واعدة تم استغلالها عبر التقنيات الحديثة لإنتاج المحاصيل التي تتطلب استهلاكاً مائياً منخفضاً مع تحقيق عوائد استثمارية عالية.",
          details: "تعتمد الظاهرة على أنظمة التحكم الآلي في المناخ الداخلي للبيوت المحمية، مما يوفر حتى 70% من المياه مقارنة بالزراعة التقليدية.",
          metrics: { investment: "100 ألف ر.ع", capacity: "8,000 هكتار", sustainability: "89%" },
          supervisor: "م. أحمد المقبالي",
          status: "استثمار حديث / بيوت محمية"
        },
        {
          code: "wusta",
          number: "04",
          name: "المنطقة الوسطى",
          area: "سهول واسعة مفتوحة غير مستغلة",
          crop: "نباتات مقاومة للملوحة وأعلاف صحراوية",
          water: "تحلية مياه بحر طاقية + آبار عميقة معالجة",
          description: "محور التوسع الصحراوي المستقبلي، مجهزة لتكون حاضنة لمشاريع الابتكار الزراعي والأبحاث الحيوية تحت شمس عُمان.",
          details: "تتيح المنطقة الوسطى مجالات هائلة لمشاريع الإنتاج الضخم بعيداً عن التكدس السكاني، مع ربط مباشر بموانئ التصدير.",
          metrics: { investment: "150 ألف ر.ع", capacity: "15,000 هكتار", sustainability: "94%" },
          supervisor: "م. خلفان الجنيبي",
          status: "مخطط استراتيجي 2040"
        },
        {
          code: "jabal",
          number: "05",
          name: "الجبل الأخضر",
          area: "مدرجات جبلية باردة",
          crop: "رمان، جوز، الورد الجبلي، وفواكه شبه استوائية",
          water: "حصاد الضباب والأمطار + نظام فلج تقليدي مطور",
          description: "أيقونة الزراعة الجبلية الفريدة في سلسلة جبال الحجر، تشتهر بمدرجاتها التاريخية وإنتاجها العالي الجودة من الفواكه والعطور الطبيعية.",
          details: "يتم دمج التراث الهندسي العُماني القديم للأفلاج مع أجهزة استشعار الرطوبة والري الحديث لضمان استدامة المدرجات.",
          metrics: { investment: "50 ألف ر.ع", capacity: "1,200 هكتار", sustainability: "98%" },
          supervisor: "أ. عائشة الحارثي",
          status: "محمي / تراثي مستدام"
        }
      ];
    }),

    getFoodSecurityMetrics: publicProcedure.query(async () => {
      return {
        title: "مؤشرات الأمن الغذائي والزراعي — رؤية عُمان 2040",
        targetYear: 2040,
        selfSufficiencyGoals: [
          { crop: "القمح الاستراتيجي", current: "18%", target: "70%+", status: "تقدم ملحوظ في مزارع النجد" },
          { crop: "التمور والنخيل", current: "95%", target: "100%", status: "اكتفاء ذاتي ومستهدفات تصديرية" },
          { crop: "الخضروات الطازجة", current: "56%", target: "85%", status: "توسع في البيوت المحمية وسهل الباطنة" },
          { crop: "الأسماك واللحوم", current: "82%", target: "95%", status: "دعم الأعلاف المحلية" }
        ],
        waterSolutionsCount: 6,
        seedSourcesCount: 6,
        totalUnexploitedAreaEst: "150,000 هكتار"
      };
    }),

    registerInquiry: publicProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string(),
          regionCode: z.string(),
          message: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return { success: true, message: "تم تسجيل الطلب وإرساله إلى مشرف المنطقة بنجاح." };
      }),
  }),
});

export type AppRouter = typeof appRouter;
