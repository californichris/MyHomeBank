using System;
using System.Configuration;
using System.Reflection;

namespace EPE.Common.Dao
{
    /// <summary>This class is use to abstract and encapsulate all access to the data source.
    /// <para>This is a singleton class and it's marked sealed to prevent derivation, which could add instances.</para>
    /// </summary> 
    /// <history>
    ///     <change date="06/06/2013" author="Christian Beltran">
    ///         Initial Version.
    ///     </change>
    /// </history>
    public sealed class DAOFactory
    {

        /* the variable is declared to be volatile to ensure that 
         * assignment to the instance variable completes before the 
         * instance variable can be accessed. */
        private static volatile DAOFactory instance;

        /* use syncRoot instance to lock on, rather than locking on 
         * the type itself, to avoid deadlocks. */
        private static object syncRoot = new Object();

        public static readonly string DBConfigParamName = "DataBaseConnString";

        private DAOFactory()
        {

        }

        public static DAOFactory Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (syncRoot)
                    {
                        if (instance == null)
                            instance = new DAOFactory();
                    }
                }

                return instance;
            }
        }

        public IPageInfoDAO GetPageInfoDAO()
        {
            string clazz = ConfigurationManager.AppSettings["IPageInfoDAO"];
            return (IPageInfoDAO)GetDAO(clazz);
        }

        public ICatalogDAO GetCatalogDAO()
        {
            string clazz = ConfigurationManager.AppSettings["ICatalogDAO"];
            return (ICatalogDAO)GetDAO(clazz);
        }

        private IBaseDAO GetDAO(string clazz)
        {
            string dbConnString = ConfigurationManager.AppSettings[DBConfigParamName];

            Type type = Type.GetType(clazz);
            ConstructorInfo constInfo = type.GetConstructor(new Type[] { typeof(string) });
            IBaseDAO instance = (IBaseDAO)constInfo.Invoke(new Object[] { dbConnString });

            return instance;
        }
    }
}