﻿using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoeAtHome.Models
{
    /// <summary>
    /// 文章评论
    /// </summary>
    public class BlogComment : TableEntity
    {
        public const string TableName = "BlogComment";
        /// <summary>
        /// 序列化的文章键
        /// </summary>
        [IgnoreProperty]
        public string SerializedBlogKey
        {
            get { return PartitionKey; }
            set { PartitionKey = value; }
        }

        /// <summary>
        /// 文章键
        /// </summary>
        [IgnoreProperty]
        public BlogKey BlogKey
        {
            get { return BlogKey.Deserialize(SerializedBlogKey); }
            set { SerializedBlogKey = value.Serialize(); }
        }

        /// <summary>
        /// 回复时间
        /// </summary>
        public DateTime DateTime { get; set; }

        /// <summary>
        /// 作者
        /// </summary>
        public string Author { get; set; }

        /// <summary>
        /// 序列化的评论的评论
        /// </summary>
        public string SerializedNestedComments { get; set; }

        /// <summary>
        /// 评论的评论
        /// </summary>
        [IgnoreProperty]
        public List<NestedComment> NestedComments
        {
            get
            {
                return JsonConvert.DeserializeObject<List<NestedComment>>(
                    SerializedNestedComments ?? string.Empty);
            }
            set { SerializedNestedComments = JsonConvert.SerializeObject(value); }
        }

        /// <summary>
        /// 评论内容
        /// </summary>
        public string Content { get; set; }

        public BlogComment()
        {
            RowKey = Guid.NewGuid().ToString();
        }
    }
}