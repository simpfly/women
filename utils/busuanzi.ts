/**
 * 不蒜子 (Busuanzi) 纯前端免后端访客统计适配器
 * 监听不蒜子脚本注入的真实 UV (独立访客数) / PV (总访问人次)
 * 提供平滑渐进与安全兜底机制
 */

export interface BusuanziStats {
  siteUv?: number; // 站点独立访客数
  sitePv?: number; // 站点总访问量
}

export function subscribeBusuanzi(
  onUpdate: (stats: BusuanziStats) => void
): () => void {
  // 检查 DOM 中是否已有挂载节点，若无则在后台创建静默监听节点
  let uvEl = document.getElementById('busuanzi_value_site_uv');
  let pvEl = document.getElementById('busuanzi_value_site_pv');

  let container: HTMLDivElement | null = null;
  if (!uvEl || !pvEl) {
    container = document.createElement('div');
    container.id = 'busuanzi_hidden_container';
    container.style.display = 'none';
    container.setAttribute('aria-hidden', 'true');

    if (!uvEl) {
      uvEl = document.createElement('span');
      uvEl.id = 'busuanzi_value_site_uv';
      container.appendChild(uvEl);
    }
    if (!pvEl) {
      pvEl = document.createElement('span');
      pvEl.id = 'busuanzi_value_site_pv';
      container.appendChild(pvEl);
    }
    document.body.appendChild(container);
  }

  const parseNumber = (el: HTMLElement | null): number | undefined => {
    if (!el) return undefined;
    const text = (el.innerText || el.textContent || '').trim().replace(/,/g, '');
    const num = parseInt(text, 10);
    return !isNaN(num) && num > 0 ? num : undefined;
  };

  const notify = () => {
    const uv = parseNumber(uvEl);
    const pv = parseNumber(pvEl);
    if (uv !== undefined || pv !== undefined) {
      onUpdate({ siteUv: uv, sitePv: pv });
    }
  };

  // 先检查一次当前节点是否已有内容
  notify();

  // 监听 DOM 文本变动（不蒜子脚本异步注入数据时会触发）
  const observer = new MutationObserver(() => {
    notify();
  });

  const config = { childList: true, characterData: true, subtree: true };
  if (uvEl) observer.observe(uvEl, config);
  if (pvEl) observer.observe(pvEl, config);

  return () => {
    observer.disconnect();
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };
}
