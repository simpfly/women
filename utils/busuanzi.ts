/**
 * 不蒜子 (Busuanzi) 纯前端免后端真实访客统计适配器
 * 在页面常驻隐藏打卡节点，接收不蒜子脚本回传的真实 UV (独立访客数)
 * 完全由 React 数据驱动渲染，杜绝 DOM 冲突与虚假数字
 */

export interface BusuanziStats {
  siteUv?: number; // 站点独立访客数
  sitePv?: number; // 站点总访问量
}

export function subscribeBusuanzi(
  onUpdate: (stats: BusuanziStats) => void
): () => void {
  // 确保页面中具有专用的隐藏打卡容器与受控节点
  let container = document.getElementById('busuanzi_hidden_container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'busuanzi_hidden_container';
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    container.setAttribute('aria-hidden', 'true');
    container.innerHTML = '<span id="busuanzi_value_site_uv"></span><span id="busuanzi_value_site_pv"></span>';
    document.body.appendChild(container);
  }

  const uvEl = document.getElementById('busuanzi_value_site_uv');
  const pvEl = document.getElementById('busuanzi_value_site_pv');

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

  // 立即检查一次
  notify();

  // 监听数据异步注入
  const observer = new MutationObserver(() => {
    notify();
  });

  const config = { childList: true, characterData: true, subtree: true };
  if (uvEl) observer.observe(uvEl, config);
  if (pvEl) observer.observe(pvEl, config);

  return () => {
    observer.disconnect();
  };
}
