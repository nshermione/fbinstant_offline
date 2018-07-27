#include "cocos2d.h"

using namespace cocos2d;

static se::Object* __jsb_ns_NativeUtils_proto = nullptr;
static se::Class* __jsb_ns_NativeUtils_class = nullptr;

/***********************************
        DEFINE CLASS
************************************/
namespace ns {
    class NativeUtils
    {
    public:
        NativeUtils()
        : xxx(0)
        {}

        void foo() {
            printf("NativeUtils::foo\n");

            Director::getInstance()->getScheduler()->schedule([this](float dt){
                static int counter = 0;
                ++counter;
                if (_cb != nullptr)
                    _cb(counter);
            }, this, 1.0f, CC_REPEAT_FOREVER, 0.0f, false, "iamkey");
        }

        static void static_func() {
            printf("NativeUtils::static_func\n");
        }

        void setCallback(const std::function<void(int)>& cb) {
            _cb = cb;
            if (_cb != nullptr)
            {
                printf("setCallback(cb)\n");
            }
            else
            {
                printf("setCallback(nullptr)\n");
            }
        }

        int xxx;
    private:
        std::function<void(int)> _cb;
    };
} // namespace ns {

/***********************************
        REGISTER FINALIZE
************************************/
static bool js_NativeUtils_finalize(se::State& s)
{
    ns::NativeUtils* cobj = (ns::NativeUtils*)s.nativeThisObject();
    delete cobj;
    return true;
}
SE_BIND_FINALIZE_FUNC(js_NativeUtils_finalize)

/***********************************
        REGISTER CONSTRUCTOR
************************************/

static bool js_NativeUtils_constructor(se::State& s)
{
    ns::NativeUtils* cobj = new ns::NativeUtils();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_NativeUtils_constructor, __jsb_ns_NativeUtils_class, js_NativeUtils_finalize)

/***********************************
        REGISTER FUNC
************************************/
static bool js_NativeUtils_foo(se::State& s)
{
    ns::NativeUtils* cobj = (ns::NativeUtils*)s.nativeThisObject();
    cobj->foo();
    return true;
}
SE_BIND_FUNC(js_NativeUtils_foo)

/***********************************
        REGISTER PROPERTY
************************************/

static bool js_NativeUtils_get_xxx(se::State& s)
{
    ns::NativeUtils* cobj = (ns::NativeUtils*)s.nativeThisObject();
    s.rval().setInt32(cobj->xxx);
    return true;
}
SE_BIND_PROP_GET(js_NativeUtils_get_xxx)

static bool js_NativeUtils_set_xxx(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc > 0)
    {
        ns::NativeUtils* cobj = (ns::NativeUtils*)s.nativeThisObject();
        cobj->xxx = args[0].toInt32();
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_NativeUtils_set_xxx)

/***********************************
        REGISTER STATIC FUNC
************************************/
static bool js_NativeUtils_static_func(se::State& s)
{
    ns::NativeUtils::static_func();
    return true;
}
SE_BIND_FUNC(js_NativeUtils_static_func)

/***********************************
        REGISTER CALLBACK
************************************/

static bool js_NativeUtils_setCallback(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc >= 1)
    {
        ns::NativeUtils* cobj = (ns::NativeUtils*)s.nativeThisObject();

        se::Value jsFunc = args[0];
        se::Value jsTarget = argc > 1 ? args[1] : se::Value::Undefined;

        if (jsFunc.isNullOrUndefined())
        {
            cobj->setCallback(nullptr);
        }
        else
        {
            assert(jsFunc.isObject() && jsFunc.toObject()->isFunction());

            // If the current NativeUtils is a class that can be created by `new`, we use se::Object::attachObject to associate jsFunc with jsTarget to the current object.
            s.thisObject()->attachObject(jsFunc.toObject());
            s.thisObject()->attachObject(jsTarget.toObject());

            // If the current NativeUtils class is a singleton, or a class that always has only one instance, we can not associate it with se::Object::attachObject.
            // Instead, you must use se::Object::root, developers do not need to unroot since unroot operation will be triggered in the destruction of lambda which makes the se::Value jsFunc be destroyed, then se::Object destructor will do the unroot operation automatically.
            // The binding function `js_cocos2dx_EventDispatcher_addCustomEventListener` implements it in this way because `EventDispatcher` is always a singleton.
            // Using s.thisObject->attachObject(jsFunc.toObject); for binding addCustomEventListener will cause jsFunc and jsTarget varibales can't be released, which will result in memory leak.

            // jsFunc.toObject()->root();
            // jsTarget.toObject()->root();

            cobj->setCallback([jsFunc, jsTarget](int counter){

                // Add the following two lines of code in CPP callback function before passing data to the JS.
                se::ScriptEngine::getInstance()->clearException();
                se::AutoHandleScope hs;
                //

                se::ValueArray args;
                args.push_back(se::Value(counter));

                se::Object* target = jsTarget.isObject() ? jsTarget.toObject() : nullptr;
                jsFunc.toObject()->call(args, target);
            });
        }

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_NativeUtils_setCallback)



/***********************************
        REGISTER CLASS
************************************/
bool js_register_ns_NativeUtils(se::Object* global)
{
    // Make sure the namespace exists
    se::Value nsVal;
    if (!global->getProperty("ns", &nsVal))
    {
        // If it doesn't exist, create one. Similar as `var ns = {};` in JS.
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);

        // Set the object to the global object with the property name `ns`.
        global->setProperty("ns", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    // Create a se::Class object, developers do not need to consider the release of the se::Class object, which is automatically handled by the ScriptEngine.
    auto cls = se::Class::create("NativeUtils", ns, nullptr, _SE(js_NativeUtils_constructor)); // If the registered class doesn't need a  constructor, the last argument can be passed in with nullptr, it will make  `new NativeUtils();` illegal.

    // Define member functions, member properties.
    cls->defineFunction("foo", _SE(js_NativeUtils_foo));
    cls->defineProperty("xxx", _SE(js_NativeUtils_get_xxx), _SE(js_NativeUtils_set_xxx));
    cls->defineFunction("setCallback", _SE(js_NativeUtils_setCallback));

    // Define finalize callback function
    cls->defineFinalizeFunction(_SE(js_NativeUtils_finalize));

    // Install the class to JS virtual machine
    cls->install();

    // JSBClassType::registerClass is a helper function in the Cocos2D-X native binding code, which is not a part of the ScriptEngine.
    JSBClassType::registerClass<ns::NativeUtils>(cls);

    // Save the result to global variable for easily use in other places, for example class inheritence.
    __jsb_ns_NativeUtils_proto = cls->getProto();
    __jsb_ns_NativeUtils_class = cls;

    // Set a property `yyy` with the string value `helloyyy` for each object instantiated by this class.
    __jsb_ns_NativeUtils_proto->setProperty("yyy", se::Value("helloyyy"));

    // Register static member variables and static member functions
    se::Value ctorVal;
    if (ns->getProperty("NativeUtils", &ctorVal) && ctorVal.isObject())
    {
        ctorVal.toObject()->setProperty("static_val", se::Value(200));
        ctorVal.toObject()->defineFunction("static_func", _SE(js_NativeUtils_static_func));
    }

    // Clear JS exceptions
    se::ScriptEngine::getInstance()->clearException();
    return true;
}
