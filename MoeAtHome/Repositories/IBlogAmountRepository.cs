﻿using MoeAtHome.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoeAtHome.Repositories
{
    public interface IBlogAmountRepository : IRepository<Models.BlogAmount>
    {
        Task<int> GetAmountAsync(DateTime date);
        Task AddAmountAsync(DateTime date);
    }
}