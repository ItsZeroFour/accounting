В этот раз я завершил работу над еще одним мои глобальным проектом. Этот проект уже посвящен финансам. На нем у вас есть возможность считать ваши деньги. При заходе на сайт вам необходимо зарегестрироваться, после чего вы попадаете на главную страницу, куда вы будите добавлять ваш доход, а система сама будет подсчитывать общее кол-во денег, сколько денег потрачено за месяц, сколько заработано и тд.
Для того, что бы добавить доход, вам необходимо нажать на плюс внизу экрана (если вы сидите с телефона), написать обычную сумму денег, без каких-ли то ниыбло знаков. Что бы добавить расходы, вам необходимо в начало, перед саммой суммой денег, поставить отрицательный знак ("-"). После чего эта сумма денег заносится в общий список ваших доходов и расходов. Общее кол-во денег за весь период у вас показывается на главное странице в самом верху.
Помимо всего прочего, у вас есть возможность посмотреть ваши доходы на графике, и процент доходов от расходов в течении месяца.
Что бы посмотреть расходы и доходы за все время, необходимо нажать "Accountings" в меню или See all под Последними транзакциями. В этом разделе вы можете менять сумму платежа или комментарий к платежу, нажам на карандаш справа.
Над дизайном приложения опять не стал особо заморачиваться, хотя стоило бы...

Что включает в себя этот проект:

Была реализована функция рандомных цитат. Она находится на странице с регистрацией.

Начал использовать модули для scss, что бы лишний раз не подключать все к одному фалу, к тому же, теперь не будет конфликтов в классах

Теперь все данные хранятся в базе данных (кроме пользовательского email'a), он хранится в localStorage. Возможно стоило бы вмечто email'a сохранять пользовательский id и уже по нему получать пользователя, но тогда это уже будет слишком большая нагрузка на проект. Последствия применения сохранения email'а, а не id таковы, что вы сможете зайти на любой аккаунт, поменяв почту в localStorage.

В прошлом моем проекте: почта, пароль и проверка на ввод кода хранилась непосредственно в localStorage, в этом проекте все хранится в firebase и вы несможете изменить эти данные при регистрации

Реализовал возможность удалять платежи. Поначалу не получалось нормально реализовать эту функцию. Она работала, но не сказать, что нормально. Функция удаляла элементы из базы данных, но элементы оставались на странице и удалялись только при перезагрузке. Хотел там и оставить, но решил довести дело до конца и воспользоватся функцией onSnapshot для получения данных в реальном времени. Это сработало и теперь можно удалять элементы без каких-либо проблем

Страница с профилем получилось скудной. В ней представлены только основные данные пользователя и больше ничего. Я не придумал, что можно сделать с этой страницей, что бы она не пустовала так. В любом случае, имеем, что имеем.

Зайдя в настройки у вас появистя возможность изменить почти все пользовательские данные (имя, парроль, почту...) Для того, что бы изменить почту, вам необходимо нажать на кнопку смены почты, после чего отправить код. Когда код отправится на вашу старую почту, появится поле с вводом этого кода. Если код совпадает, то вы вводите новую почту и нажимаете на кнопку! Так же и со сменой пола, нажимаете на кнопку, но уже всплывающего окна не появится, заместо этого будет меню выбора пола снизу под кнопкой. Когда вы измените какие-либо данные, появится кнопка с сохранением этих данных.
Помимо смены данных пользователя есть так же смена смена отоброжаемого имени (вместо никнейма на полное имя или наоборот), сменя валюты, языка и как в предыдущем проекте, реализовал смену темы со светлой на темную, но уже другим способом (при помощи дата аттрибутов для body). Он более быстрее и удобнее.

В разделе со всеми доходами и расходами я сделал пагинацию. Теперь рендеринг массива будет оптемезированнее, да и так выглядит гораздо удобнее

Я решил добавлять к своему коду развернутые комментарии, что бы проще было ореентироваться по коду, да и так выглядит более структурированно, чем без них или с однострочными комментариями

/_ Небольшое отступление _\
Это мой 5й проект, который я публично презентую на своей странице. И каждый новый проект превосходит другой. В каждом новом проекте я использую те навыки, которым научился в предыдущем, дорабатываю то, что было плохо реализовано раньше и реализию то, что не получилось! Научившись работать с firebase я использую его постоянно в каждом следующем проекте. Научившись делать полноценную регистрацию, я использую ее в каждом своем новом проекте и т.д. Раньше я считал свой первый проект (который я презентовал на своей странице) самым моштабным в моей деятельности. Теперь, спустя несколько проектов, он уже не кажется таким масшабным. Я доволен своим результатом :). Думаю, следующие проекты будут не менее масштабными, чем этот или приложение знакомств, а то и будет превосходить их в несколько раз!