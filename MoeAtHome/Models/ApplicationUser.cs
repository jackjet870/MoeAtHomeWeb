using leeksnet.AspNet.Identity.TableStorage;
using System.Globalization;

namespace MoeAtHome.Models
{
    /// <summary>
    /// �û���Ϣ
    /// </summary>
    public class ApplicationUser : IdentityUser
    {
        /// <summary>
        /// �ʼ���ַ
        /// </summary>
        public string Email { get; set; }

        internal static string GetPartitionKeyFromId(string id)
        {
            return id;
        }
    }
}
