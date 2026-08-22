# مواصفة بيانات النسخة الأولى — منصة الاستثمار الزراعي في عُمان

## 1. حدود قاعدة البيانات

يغطي هذا المخطط دورة التشغيل من اعتماد الأرض إلى شحنة البيع أو التصدير. تعتمد جميع الجداول أسماء حقول بأسلوب `camelCase` المتوافق مع مشروع Drizzle، وتستخدم المفاتيح الرقمية الداخلية للعلاقات. تحفظ الملفات والصور خارج قاعدة البيانات في تخزين كائني، وتُسجل القاعدة مفتاح الملف والرابط والبيانات الوصفية فقط.

| اصطلاح | قاعدة التطبيق |
|---|---|
| الزمن | تحفظ جميع التواريخ التشغيلية كـ `datetime` بتوقيت UTC؛ تعرض الواجهة وقت المستخدم محلياً. |
| المبالغ | `decimal(14,3)` مع `currencyCode CHAR(3)` عند الحاجة؛ لا تستخدم `float` للمال أو الأوزان. |
| الكميات | `decimal(14,3)` مع حقل وحدة صريح مثل `kg` أو `ton` أو `m3`. |
| الحالة | تستخدم `enum` أو جدول مرجعي عندما تكون القائمة قابلة للتغيير حسب السوق. |
| الحذف | لا يُحذف السجل التشغيلي أو التصديري حذفاً نهائياً؛ يستخدم `archivedAt` أو تغيير الحالة مع سجل تدقيق. |
| الملكية | كل سجل تشغيلي يحمل `organizationId` لحصر البيانات بين الشركات أو المحافظ الاستثمارية. |

## 2. قاموس البيانات

### 2.1 الحوكمة والهوية

| الجدول | الحقول وأنواعها | القيود والعلاقات |
|---|---|---|
| `organizations` | `id int PK`, `legalName varchar(255)`, `displayName varchar(150)`, `commercialRegistrationNo varchar(100)`, `status enum(active, suspended)`, `createdAt datetime`, `updatedAt datetime` | `legalName` مطلوب؛ `commercialRegistrationNo` فريد عند إدخاله؛ أصل بيانات المزارع والعملاء. |
| `users` | جدول الهوية المبدئي الموجود: `id int PK`, `openId varchar(64)`, `name text`, `email varchar(320)`, `role enum(user,admin)`, تواريخ الجلسة | يبقى مصدر مصادقة النظام؛ لا يُعدل سجل المستخدم لإضافة منطق تشغيلي. |
| `organizationUsers` | `id int PK`, `organizationId int`, `userId int`, `accessRole enum(platform_admin,investment_manager,farm_manager,agronomist,field_supervisor,warehouse_manager,quality_manager,sales_export_manager,viewer)`, `isActive boolean`, `createdAt datetime` | فهرس فريد على `(organizationId,userId)`؛ FK إلى `organizations` و`users`؛ يفصل الدور التشغيلي عن الدور العام في الحساب. |
| `auditLogs` | `id bigint PK`, `organizationId int`, `actorUserId int nullable`, `entityType varchar(80)`, `entityId varchar(80)`, `action enum(create,update,archive,approve,release,hold,export)`, `beforeJson json nullable`, `afterJson json nullable`, `requestId varchar(64)`, `createdAt datetime` | فهرس على `(organizationId,entityType,entityId,createdAt)`؛ لا تحديث أو حذف من التطبيق. |

### 2.2 الأرض والمياه والتقييم

| الجدول | الحقول وأنواعها | القيود والعلاقات |
|---|---|---|
| `farms` | `id int PK`, `organizationId int`, `name varchar(150)`, `governorate varchar(100)`, `wilayat varchar(100)`, `status enum(prospect,active,inactive)`, `latitude decimal(10,7) nullable`, `longitude decimal(10,7) nullable`, `createdAt datetime`, `updatedAt datetime` | `organizationId` مطلوب؛ فهرس `(organizationId,status)`؛ إحداثيات اختيارية إلى أن يعتمد الموقع. |
| `landParcels` | `id int PK`, `farmId int`, `parcelCode varchar(60)`, `tenureType enum(owned,lease,right_of_use,partnership)`, `areaHectares decimal(12,4)`, `tenureStartAt date nullable`, `tenureEndAt date nullable`, `approvalStatus enum(draft,under_review,approved,rejected)`, `geometryJson json nullable` | فريد على `(farmId,parcelCode)`؛ `areaHectares > 0`؛ لا يصبح `approved` من دون مستند حق استخدام. |
| `plots` | `id int PK`, `landParcelId int`, `plotCode varchar(60)`, `areaHectares decimal(12,4)`, `productionMethod enum(open_field,greenhouse,hydroponic,other)`, `isActive boolean`, `geometryJson json nullable` | فريد على `(landParcelId,plotCode)`؛ مساحة موجبة؛ مجموع مساحات الحقول لا يتحقق منه قيد SQL بل تقرير مراجعة. |
| `soilTests` | `id int PK`, `landParcelId int`, `sampledAt datetime`, `laboratoryName varchar(200)`, `ph decimal(5,2) nullable`, `ecDsM decimal(7,3) nullable`, `organicMatterPct decimal(6,3) nullable`, `reportFileKey varchar(500) nullable`, `status enum(pending,reviewed,accepted,rejected)`, `reviewedByUserId int nullable` | FK إلى الأرض والمستخدم؛ تقرير المختبر مطلوب عند جعل الحالة `accepted`. |
| `waterSources` | `id int PK`, `farmId int`, `sourceCode varchar(60)`, `sourceType enum(well,network,treated,seawater,other)`, `licenseReference varchar(150) nullable`, `estimatedFlowM3Hour decimal(12,3) nullable`, `isActive boolean` | فريد على `(farmId,sourceCode)`؛ الرقم الترخيصي لا يدل بذاته على موافقة قانونية. |
| `waterTests` | `id int PK`, `waterSourceId int`, `sampledAt datetime`, `salinityPpt decimal(7,3) nullable`, `ecDsM decimal(7,3) nullable`, `ph decimal(5,2) nullable`, `laboratoryName varchar(200)`, `reportFileKey varchar(500) nullable`, `reviewStatus enum(pending,accepted,rejected)` | FK إلى `waterSources`؛ يمنع بدء موسم جديد إذا لم توجد نتيجة مقبولة وفق سياسة المنظمة. |
| `farmOpportunities` | `id int PK`, `organizationId int`, `name varchar(150)`, `governorate varchar(100)`, `areaHectares decimal(12,4) nullable`, `sourceType enum(landowner,tender,broker,government,other)`, `stage enum(new,screening,due_diligence,investment_committee,approved,rejected)`, `fitScore decimal(5,2) nullable`, `decisionNotes text nullable`, `createdAt datetime` | فهرس `(organizationId,stage)`؛ يبقى مستقلاً إلى أن يتحول إلى `farm` مع رابط تحويل محفوظ في سجل التدقيق. |

### 2.3 الزراعة والعمليات

| الجدول | الحقول وأنواعها | القيود والعلاقات |
|---|---|---|
| `crops` | `id int PK`, `commonNameAr varchar(150)`, `commonNameEn varchar(150) nullable`, `scientificName varchar(200) nullable`, `defaultUnit varchar(20)`, `isActive boolean` | فريد على `commonNameAr`؛ وحدة افتراضية للعرض فقط. |
| `cropVarieties` | `id int PK`, `cropId int`, `name varchar(150)`, `supplierName varchar(200) nullable`, `daysToHarvest int nullable`, `isActive boolean` | فريد على `(cropId,name)`؛ FK إلى `crops`. |
| `seasons` | `id int PK`, `organizationId int`, `plotId int`, `cropVarietyId int`, `seasonCode varchar(80)`, `status enum(draft,planned,active,harvested,closed,cancelled)`, `plannedPlantingAt date`, `actualPlantingAt date nullable`, `plannedHarvestAt date nullable`, `budgetAmount decimal(14,3) nullable`, `currencyCode char(3) nullable`, `targetYieldKg decimal(14,3) nullable`, `createdByUserId int`, `createdAt datetime`, `updatedAt datetime` | فريد على `(plotId,seasonCode)`؛ لا يسمح بموسمين `active` للحقل نفسه في الإنتاج المكشوف إلا بمراجعة إدارية. |
| `fieldActivities` | `id bigint PK`, `organizationId int`, `seasonId int`, `activityType enum(planting,irrigation,fertilization,pest_control,pruning,inspection,harvest_support,other)`, `performedAt datetime`, `performedByUserId int nullable`, `notes text nullable`, `costAmount decimal(14,3) nullable`, `currencyCode char(3) nullable`, `evidenceFileKey varchar(500) nullable`, `createdAt datetime` | فهرس `(seasonId,performedAt)`؛ لا يمكن إدخال نشاط لموسم `closed`؛ النشاط لا يُحذف بعد الاعتماد. |
| `irrigationLogs` | `id bigint PK`, `fieldActivityId bigint`, `waterSourceId int`, `volumeM3 decimal(14,3)`, `durationMinutes int nullable`, `method enum(drip,sprinkler,hydroponic,manual,other)`, `recordedAt datetime` | FK فريد إلى النشاط عند اعتماد مبدأ سجل واحد لكل نشاط ري؛ `volumeM3 > 0`. |
| `inputItems` | `id int PK`, `organizationId int`, `name varchar(200)`, `category enum(seed,seedling,fertilizer,pesticide,packaging,fuel,other)`, `unit varchar(20)`, `requiresBatchTrace boolean`, `isActive boolean` | فريد على `(organizationId,name,category)`؛ يقبل المدخلات الزراعية ومواد التعبئة. |
| `inputBatches` | `id int PK`, `inputItemId int`, `supplierName varchar(200) nullable`, `supplierLotNo varchar(120) nullable`, `receivedAt datetime`, `quantityReceived decimal(14,3)`, `quantityAvailable decimal(14,3)`, `expiryAt date nullable`, `unitCost decimal(14,3) nullable`, `currencyCode char(3) nullable`, `certificateFileKey varchar(500) nullable` | `quantityAvailable` لا تصبح سالبة؛ فهرس على `(inputItemId,expiryAt)`. |
| `inputUsage` | `id bigint PK`, `fieldActivityId bigint`, `inputBatchId int`, `quantityUsed decimal(14,3)`, `unit varchar(20)`, `notes text nullable` | فريد على `(fieldActivityId,inputBatchId)`؛ المعاملة التطبيقية تنقص المتاح في الدفعة وتكتب سجل التدقيق. |

### 2.4 الحصاد والجودة والمخزون

| الجدول | الحقول وأنواعها | القيود والعلاقات |
|---|---|---|
| `harvestLots` | `id bigint PK`, `organizationId int`, `seasonId int`, `lotCode varchar(100)`, `harvestedAt datetime`, `grossWeightKg decimal(14,3)`, `netSellableWeightKg decimal(14,3) nullable`, `initialGrade varchar(50) nullable`, `status enum(created,quality_hold,released,rejected,consumed)`, `createdByUserId int`, `createdAt datetime` | فريد على `(organizationId,lotCode)`؛ `grossWeightKg > 0`؛ لا يخصص للبيع قبل `released`. |
| `lotQualityTests` | `id bigint PK`, `harvestLotId bigint`, `testType enum(visual,weight,residue,microbiology,other)`, `laboratoryName varchar(200) nullable`, `sampledAt datetime`, `resultStatus enum(pending,pass,fail,conditional)`, `resultJson json nullable`, `reportFileKey varchar(500) nullable`, `verifiedByUserId int nullable`, `verifiedAt datetime nullable` | فهرس `(harvestLotId,testType,sampledAt)`؛ يتطلب ملف نتيجة للأنواع المختبرية عند التحقق. |
| `qualityHolds` | `id bigint PK`, `harvestLotId bigint`, `reasonCode varchar(80)`, `reasonNotes text`, `heldAt datetime`, `releasedAt datetime nullable`, `releasedByUserId int nullable`, `status enum(active,released,converted_to_rejection)` | لا يمكن أن يوجد أكثر من حجز نشط لنفس الدفعة؛ ينشئ النظام الحجز عند فشل اختبار حرج. |
| `warehouses` | `id int PK`, `organizationId int`, `farmId int nullable`, `name varchar(150)`, `warehouseType enum(farm_store,cold_store,packhouse,external),` `temperatureControlled boolean`, `isActive boolean` | فريد على `(organizationId,name)`؛ الموقع الخارجي يحتاج اسم مشغل في حقل ملاحظات لاحق. |
| `inventoryLots` | `id bigint PK`, `organizationId int`, `harvestLotId bigint nullable`, `inputBatchId int nullable`, `warehouseId int`, `sku varchar(100)`, `lotCode varchar(100)`, `quantityOnHand decimal(14,3)`, `unit varchar(20)`, `inventoryStatus enum(available,reserved,held,rejected,consumed)`, `receivedAt datetime`, `expiryAt datetime nullable` | يجب أن يكون أحد `harvestLotId` أو `inputBatchId` موجوداً؛ فريد على `(organizationId,warehouseId,lotCode,sku)`؛ لا رصيد سالب. |
| `inventoryMovements` | `id bigint PK`, `inventoryLotId bigint`, `movementType enum(receipt,transfer,reserve,unreserve,shipment,adjustment,discard)`, `quantity decimal(14,3)`, `fromWarehouseId int nullable`, `toWarehouseId int nullable`, `occurredAt datetime`, `referenceType varchar(80) nullable`, `referenceId varchar(80) nullable`, `createdByUserId int` | فهرس `(inventoryLotId,occurredAt)`؛ التحقق من الرصيد يتم ضمن معاملة DB؛ لا تحديث بعد الإنشاء. |
| `packagingRuns` | `id bigint PK`, `organizationId int`, `harvestLotId bigint`, `outputInventoryLotId bigint`, `packagedAt datetime`, `grade varchar(50)`, `inputWeightKg decimal(14,3)`, `outputWeightKg decimal(14,3)`, `wasteWeightKg decimal(14,3)`, `packagingFormat varchar(100)` | تحقق تطبيق: `inputWeightKg = outputWeightKg + wasteWeightKg` ضمن سماحية مذكورة؛ يوثق مصدر المنتج المعبأ. |

### 2.5 المبيعات والتصدير والوثائق

| الجدول | الحقول وأنواعها | القيود والعلاقات |
|---|---|---|
| `customers` | `id int PK`, `organizationId int`, `legalName varchar(255)`, `countryCode char(2)`, `customerType enum(local_wholesale,retail,food_service,exporter,importer,processor)`, `taxReference varchar(100) nullable`, `contactName varchar(150) nullable`, `email varchar(320) nullable`, `phone varchar(50) nullable`, `status enum(prospect,active,blocked)` | فريد على `(organizationId,legalName,countryCode)`؛ يحدد بلد المقصد الافتراضي لا متطلبات الشحن بمفرده. |
| `salesOrders` | `id bigint PK`, `organizationId int`, `customerId int`, `orderNo varchar(100)`, `orderDate datetime`, `fulfillmentType enum(local_delivery,export)`, `status enum(draft,confirmed,allocated,fulfilled,cancelled)`, `currencyCode char(3)`, `paymentTerms varchar(100) nullable`, `totalAmount decimal(14,3) nullable`, `createdByUserId int` | فريد على `(organizationId,orderNo)`؛ لا يمكن `confirmed` بلا عميل وسطر طلب واحد. |
| `salesOrderLines` | `id bigint PK`, `salesOrderId bigint`, `productDescription varchar(255)`, `quantity decimal(14,3)`, `unit varchar(20)`, `unitPrice decimal(14,3)`, `allocatedInventoryLotId bigint nullable`, `qualitySpecificationJson json nullable` | لا تخصيص لدفعة محتجزة أو مرفوضة؛ كمية موجبة؛ يربط التخصيص بدفعة مخزون قابلة للتتبع. |
| `exportMarkets` | `id int PK`, `countryCode char(2)`, `countryNameAr varchar(120)`, `isActive boolean`, `notes text nullable` | فريد على `countryCode`؛ قائمة مرجعية للبلدان التي اختبرت أعمالها. |
| `exportRequirements` | `id bigint PK`, `organizationId int`, `exportMarketId int`, `cropId int nullable`, `requirementCode varchar(100)`, `title varchar(255)`, `requirementType enum(document,quality,packaging,labeling,logistics)`, `isRequired boolean`, `validFrom date nullable`, `validTo date nullable`, `sourceUrl varchar(500) nullable`, `status enum(draft,verified,retired)` | فريد على `(organizationId,exportMarketId,cropId,requirementCode,validFrom)`؛ لا تعتبر التهيئة تأكيداً قانونياً تلقائياً. |
| `exportShipments` | `id bigint PK`, `organizationId int`, `salesOrderId bigint`, `exportMarketId int`, `shipmentNo varchar(100)`, `status enum(draft,document_check,ready_to_ship,shipped,delivered,cancelled)`, `plannedDepartureAt datetime nullable`, `actualDepartureAt datetime nullable`, `carrierName varchar(200) nullable`, `containerReference varchar(120) nullable`, `incoterm varchar(20) nullable` | فريد على `(organizationId,shipmentNo)`؛ لا تصبح `ready_to_ship` قبل اجتياز `documentChecks`. |
| `complianceDocuments` | `id bigint PK`, `organizationId int`, `documentType enum(origin,packing_list,customs_declaration,residue_report,phytosanitary,food_safety,invoice,other)`, `harvestLotId bigint nullable`, `exportShipmentId bigint nullable`, `documentNumber varchar(150) nullable`, `issuedAt datetime nullable`, `expiresAt datetime nullable`, `fileKey varchar(500)`, `verificationStatus enum(uploaded,under_review,verified,rejected,expired)`, `verifiedByUserId int nullable` | يجب أن يرتبط المستند بدفعة أو شحنة على الأقل؛ فهرس `(exportShipmentId,documentType,verificationStatus)`. |
| `documentChecks` | `id bigint PK`, `exportShipmentId bigint`, `exportRequirementId bigint`, `complianceDocumentId bigint nullable`, `status enum(missing,present,verified,failed,waived)`, `checkedByUserId int nullable`, `checkedAt datetime nullable`, `notes text nullable` | فريد على `(exportShipmentId,exportRequirementId)`؛ يمنع التحويل إلى `ready_to_ship` إن وُجد `missing` أو `failed` لمتطلب إلزامي. |

## 3. مؤشرات وفهارس يجب إنشاؤها

| الاستعلام التشغيلي | الفهرس المطلوب |
|---|---|
| قائمة المواسم النشطة لمزرعة | `seasons(plotId, status)` ثم صلة إلى `plots(landParcelId)` |
| أنشطة موسم خلال نطاق زمني | `fieldActivities(seasonId, performedAt)` |
| تتبع دفعة إلى الحقل والبيع | `harvestLots(organizationId, lotCode)`, `inventoryLots(harvestLotId)`, `salesOrderLines(allocatedInventoryLotId)` |
| دفعات محتجزة أو فاشلة | `harvestLots(organizationId,status)`, `qualityHolds(harvestLotId,status)` |
| جاهزية شحنة التصدير | `exportShipments(organizationId,status)`, `documentChecks(exportShipmentId,status)` |
| رصيد مخزون موقع | `inventoryLots(organizationId,warehouseId,inventoryStatus)` |

## 4. خطة الترحيلات (Migrations)

يجب أن تكتب التغييرات في `drizzle/schema.ts` أولاً، ثم يُشغَّل توليد الترحيل، وتُراجع SQL الناتجة قبل تطبيقها على قاعدة البيانات. لا تستخدم دفع المخطط المباشر إلى الإنتاج. كل ترحيل يحمل اسماً مرتّباً ولا يُعدّل بعد تطبيقه.

| الترحيل | المحتوى | التحقق قبل التطبيق |
|---|---|---|
| `0001_governance_foundation` | `organizations`, `organizationUsers`, `auditLogs`، وفهارس العزل | مستخدم مالك موجود ويمكن ربطه بمنظمة دون تكرار |
| `0002_land_and_water` | المزارع، قطع الأرض، الحقول، فحوص التربة والماء، فرص الأراضي | إنشاء موقع تجريبي وحقل واحد ونتيجة فحص |
| `0003_crop_operations` | المحاصيل والأصناف والمواسم والأنشطة والري والمدخلات | إنشاء موسم وتشغيل نشاط وخصم كمية إدخال في معاملة واحدة |
| `0004_harvest_quality_inventory` | الحصاد، فحوص الجودة، الحجز، المستودعات، المخزون، الحركات والتعبئة | تتبع دفعة من حقل إلى مخزون متاح وحالة حجز |
| `0005_sales_export_compliance` | العملاء والطلبات والأسواق والمتطلبات والشحن والوثائق والفحوص | منع شحنة ناقصة الوثائق من الجاهزية |
| `0006_reporting_views` | مشاهد أو استعلامات مادية عند الحاجة فقط | مطابقة تقارير الإنتاج والمخزون مع الجداول المصدرية |
| `0007_seed_reference_data` | قواميس المحاصيل، الحالات، وحدات القياس، أسواق تجريبية | لا تُزرع بيانات عملاء أو طلبات أو مراجعات مزيفة |

### ترتيب التطبيق وضوابط الأمان

تُطبق الترحيلات على بيئة تطوير ثم معاينة ثم إنتاج. قبل كل تطبيق، تؤخذ نسخة من المخطط وتراجع الترحيلات السابقة. لا تُحذف أعمدة أو جداول تُستخدم في الإنتاج في نفس الإصدار الذي يتوقف فيه التطبيق عن استخدامها؛ يُتبع أسلوب «إضافة، ترحيل بيانات، قراءة مزدوجة عند الحاجة، ثم إيقاف تدريجي» لتجنب فقدان بيانات المزرعة أو الشحنات.

## 5. إجراءات الخادم المطلوبة في النسخة الأولى

| نطاق الإجراء | عمليات tRPC المقترحة | الحماية |
|---|---|---|
| الأراضي | `land.list`, `land.create`, `land.reviewOpportunity`, `land.recordSoilTest` | مدير الاستثمار أو مدير المنصة |
| التشغيل | `season.create`, `season.activate`, `activity.record`, `input.receive`, `input.consume` | مدير المزرعة أو مهندس مخول |
| الحصاد والجودة | `harvest.createLot`, `quality.recordTest`, `quality.hold`, `quality.release` | جودة أو مدير مخول؛ لا تحرير بعد الاعتماد |
| المخزون | `inventory.list`, `inventory.transfer`, `inventory.adjust` | أمين المخزن؛ التعديل يتطلب سبباً |
| البيع والتصدير | `sales.createOrder`, `export.createShipment`, `export.runDocumentCheck` | مبيعات وتصدير؛ اعتماد الإدارة لحالات الإطلاق |
| التقارير | `reports.farmPerformance`, `reports.waterEfficiency`, `reports.exportReadiness` | صلاحية عرض حسب المنظمة |

## 6. اختبار سلامة البيانات

قبل إصدار أي واجهة، تُكتب اختبارات وحدة لثلاثة مسارات حرجة: لا يجوز أن ينخفض رصيد مدخل أو مخزون تحت الصفر، ولا يجوز تحرير دفعة فشلت في اختبار حرج دون سبب ومستخدم مخول، ولا يجوز جعل شحنة تصدير جاهزة مع وثيقة إلزامية مفقودة. هذه الاختبارات جزء من معيار قبول النظام وليست تحسيناً اختيارياً.
